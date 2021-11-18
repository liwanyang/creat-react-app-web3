import * as PropTypes from 'prop-types'
import * as React from 'react'
import { ethers } from 'ethers'
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  UnsupportedChainIdError,
  Web3ReactProvider,
  useWeb3React,
} from '@web3-react/core'
import JSBI from 'jsbi'
import {
  Account,
  AccountType,
  Balance,
  EthereumProvider,
  Status,
  Wallet,
  WalletContext,
  UseWalletProviderProps
} from './types'
import { getConnectors } from './connectors'
import {
  ConnectionRejectedError,
  ChainUnsupportedError,
  ConnectorUnsupportedError,
} from './errors'
import {
  divDecimals,
  divDecimalsByBigNumber,
  getAccountBalance,
  getAccountIsContract,
  getGasPrice,
  getNetworkName,
  getTokenBalance,
  mulDecimals,
  pollEvery,
} from './utils'
import { useContract } from '../hooks/ethereum'
import { ChainId, Tokens, TokenNames, COIN_TOKENS, Token } from '../constants/index'
import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import * as ConfigActions from '../store/actions/todo';
import { useActions } from '../store/actions'
import { useSelector } from 'react-redux'
import { RootState } from '../store/reducers'
export const NO_BALANCE = '0.00000001'


const UseWalletContext = React.createContext<WalletContext>(null)


function useWallet(): Wallet {
  const walletContext = useContext(UseWalletContext)

  if (walletContext === null) {
    throw new Error(
      'useWallet() can only be used inside of <UseWalletProvider />, ' +
        'please declare it at a higher level.'
    )
  }
  const { wallet } = walletContext
  
  return useMemo(() => {
    return { ...wallet }
  }, [wallet])
}


function useWalletBalance({
  account,
  ethereum,
  pollBalanceInterval
}: {
  account?: Account | null
  ethereum?: EthereumProvider
  pollBalanceInterval: number
}) {
  const [balance, setBalance] = useState<Balance>(NO_BALANCE)

  useEffect(() => {
    if (!account || !ethereum) {
      return
    }

    let cancel = false

    // Poll wallet balance
    const pollBalance = pollEvery<Balance, any>(
      (
        account: Account,
        ethereum: EthereumProvider,
        onUpdate: (balance: Balance) => void
      ) => {
        let lastBalance = NO_BALANCE
        return {
          async request() {
            return getAccountBalance(ethereum, account)
              .then((value) => {
                return value ? JSBI.BigInt(value).toString() : NO_BALANCE
              })
              .catch(() => NO_BALANCE)
          },
          onResult(balance: Balance) {
            const balances = divDecimals(balance as string, 18).toString()
            if (!cancel && balances !== lastBalance.toString()) {
              lastBalance = balances
              onUpdate(balances)
            }
          },
        }
      },
      pollBalanceInterval
    )

    // start polling balance every x time
    const stopPollingBalance = pollBalance(account, ethereum, setBalance)

    return () => {
      cancel = true
      stopPollingBalance()
    }
  }, [account, ethereum, pollBalanceInterval])

  return balance
}

export function useWalletBalancex({
  contractToken,
  pollBalanceInterval,
}: {
  contractToken: Token | null
  pollBalanceInterval: number
}) {
  const [balance, setBalance] = useState<Balance>(NO_BALANCE)
  const { library, chainId, account } = useWeb3React()

  useEffect(() => {
    if (!account) {
      return
    }

    if (!chainId) {
      return
    }
    const contractAddress = contractToken ? contractToken.address : '';
    let cancel = false

    // Poll wallet balance
    const pollBalance = pollEvery<Balance, any>(
      (
        account: Account,
        onUpdate: (balance: Balance) => void
      ) => {
        let lastBalance = NO_BALANCE
        return {
          async request() {

            return getTokenBalance(contractAddress!, account, library)
              .then((value: Balance) => {
                return value ? JSBI.BigInt(value).toString() : NO_BALANCE
              })
              .catch(() => NO_BALANCE)
          },
          onResult(balance: Balance) {
            const balances = divDecimals(balance as string, contractToken?.decimals!).toString()
            if (!cancel && balances !== lastBalance.toString()) {
              lastBalance = balances
              onUpdate(balances)
            }
          },
        }
      },
      pollBalanceInterval
    )

    // start polling balance every x time
    const stopPollingBalance = pollBalance(account, setBalance)
    

    return () => {
      cancel = true
      stopPollingBalance()
    }
  }, [account, chainId, contractToken, library, pollBalanceInterval])

  return balance
}

function UseWalletProvider({
  chainId,
  children,
  // connectors contains init functions and/or connector configs.
  connectors: connectorsInitsOrConfigs,
  pollBalanceInterval,
  pollBlockNumberInterval,
}: UseWalletProviderProps) {
  const walletContext = useContext(UseWalletContext)

  if (walletContext !== null) {
    throw new Error('<UseWalletProvider /> has already been declared.')
  }
  const [block, setBlockNumber] = useState<{ chainId: number | undefined; blockNumber: number | null }>({
    chainId,
    blockNumber: null
  })
  const [connector, setConnector] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [type, setType] = useState<AccountType | null>(null)
  const [status, setStatus] = useState<Status>('disconnected')
  const web3ReactContext = useWeb3React()
  const activationId = useRef<number>(0)
  const { account, library: ethereum, chainId: chainIds } = web3ReactContext

  // 获取AITD余额
  const balance = useWalletBalance({ account, ethereum, pollBalanceInterval})
  // 获取WAITD代币余额
  const balancex = useWalletBalancex({
    contractToken: chainIds ? Tokens[chainIds as ChainId][0]: null,
    pollBalanceInterval 
  })
  // Combine the user-provided connectors with the default ones (see connectors.js).
  const connectors = useMemo(
    () => getConnectors(connectorsInitsOrConfigs),
    [connectorsInitsOrConfigs]
  )

  const reset = useCallback(() => {
    if (web3ReactContext.active) {
      web3ReactContext.deactivate()
    }
    setConnector(null)
    setError(null)
    setStatus('disconnected')
  }, [web3ReactContext])

  const connect = useCallback(
    async (connectorId = 'injected') => {

      // Prevent race conditions between connections by using an external ID.
      const id = ++activationId.current

      reset()

      // Check if another connection has happened right after deactivate().
      if (id !== activationId.current) {
        return
      }

      if (!connectors[connectorId]) {
        setStatus('error')
        setError(new ConnectorUnsupportedError(connectorId))
        return
      }

      // If no connection happens, we're in the right context and can safely update
      // the connection stage status
      setStatus('connecting')

      const [connectorInit, connectorConfig] = connectors[connectorId] || []

      // Initialize the (useWallet) connector if it exists.
      const connector = await connectorInit?.()

      // Initialize the web3-react connector if it exists.
      const web3ReactConnector = connector?.web3ReactConnector?.({
        chainId,
        ...(connectorConfig || {}),
      })

      if (!web3ReactConnector) {
        setStatus('error')
        setError(new ConnectorUnsupportedError(connectorId))
        return
      }

      try {
        // TODO: there is no way to prevent an activation to complete, but we
        // could reconnect to the last provider the user tried to connect to.
        setConnector(connectorId)
        await web3ReactContext.activate(web3ReactConnector, undefined, true)
        setStatus('connected')
      } catch (err: any) {
        // Don’t throw if another connection has happened in the meantime.
        if (id !== activationId.current) {
          return
        }

        // If not, the error has been thrown during the current connection attempt,
        // so it's correct to indicate that there has been an error
        setConnector(null)
        setStatus('error')

        if (err instanceof UnsupportedChainIdError) {
          setError(new ChainUnsupportedError(-1, chainId))
          return
        }
        // It might have thrown with an error known by the connector
        if (connector.handleActivationError) {
          const handledError = connector.handleActivationError(err)
          if (handledError) {
            setError(handledError)
            return
          }
        }
        // Otherwise, set to state the received error
        setError(err)
      }
    },
    [chainId, connectors, reset, web3ReactContext]
  )
  
  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setBlockNumber(state => {
        if (chainId === state.chainId) {
          if (typeof state.blockNumber !== 'number') return { chainId, blockNumber }
          return { chainId, blockNumber: Math.max(blockNumber, state.blockNumber) }
        }
        return state
      })
    },
    [chainId]
  )

  useEffect(() => {
    if (!account || !ethereum) {
      return
    }

    let cancel = false

    setType(null)

    getAccountIsContract(ethereum, account).then((isContract) => {
      if (!cancel) {
        setStatus('connected')
        setType(isContract ? 'contract' : 'normal')
      }
    })
    
    if (!ethereum || !chainId) return undefined

    setBlockNumber({ chainId, blockNumber: null })

    // ethereum
    //   .getBlockNumber()
    //   .then(blockNumberCallback)
    //   .catch((error: any) => console.error(`Failed to get block number for chainId: ${chainId}`, error))

    //   ethereum.on('block', blockNumberCallback)

    return () => {
      cancel = true
      setStatus('disconnected')
      setType(null)
      ethereum.removeListener('block', blockNumberCallback)
    }
  }, [account, blockNumberCallback, chainId, ethereum])

  const wallet = useMemo(
    () => ({
      _web3ReactContext: web3ReactContext,
      account: account || null,
      balance,
      balancex,
      chainId,
      connect,
      connector,
      connectors,
      error,
      ethereum,
      networkName: getNetworkName(chainId),
      reset,
      status,
      type
    }),
    [
      account,
      balancex,
      chainId,
      balance,
      connect,
      connector,
      connectors,
      error,
      ethereum,
      type,
      reset,
      status,
      web3ReactContext
    ]
  )
  return (
    <section>
      <UseWalletContext.Provider
        value={{
          blockNumber: block.blockNumber,
          pollBalanceInterval,
          pollBlockNumberInterval,
          wallet,
        }}
      >
        {children}
      </UseWalletContext.Provider>
    </section>
  )
}

UseWalletProvider.propTypes = {
  chainId: PropTypes.number,
  children: PropTypes.node,
  connectors: PropTypes.objectOf(PropTypes.object),
  pollBalanceInterval: PropTypes.number,
  pollBlockNumberInterval: PropTypes.number,
}

UseWalletProvider.defaultProps = {
  chainId: 1,
  connectors: {},
  pollBalanceInterval: 10000,
  pollBlockNumberInterval: 10000,
}

function getLibrary(provider: any) {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = 10000
  return library
}

function UseWalletProviderWrapper(props: UseWalletProviderProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <UseWalletProvider {...props} />
    </Web3ReactProvider>
  )
}

UseWalletProviderWrapper.propTypes = UseWalletProvider.propTypes
UseWalletProviderWrapper.defaultProps = UseWalletProvider.defaultProps

export {
  ConnectionRejectedError,
  ChainUnsupportedError,
  ConnectorUnsupportedError,
  UseWalletProviderWrapper as UseWalletProvider,
  useWallet,
}

export default useWallet
