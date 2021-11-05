import { ethers } from 'ethers'
import { Account, EthereumProvider } from './types'
import UncheckedJsonRpcSigner from './signer'
import Web3 from 'web3'
import BN from 'bn.js'
import BigNumber from 'bignumber.js'
import {COIN_TOKENS, ERC20_ABI_DEG, TokenNames} from '../constants'

const KNOWN_CHAINS = new Map<number, string>([
  [19, 'AITDMAIN'],
  [239, 'AITDTEST'],
  [1337, 'AITDETH'],
])
export function getNetworkName(chainId: number) {
  return KNOWN_CHAINS.get(chainId) || 'Unknown'
}

function isUnwrappedRpcResult(response: unknown): response is {
  error?: string
  result?: unknown
} {
  return (
    typeof response === 'object' && response !== null && 'jsonrpc' in response
  )
}

export function rpcResult(response: unknown): unknown | null {
  // Some providers don’t wrap the response
  if (isUnwrappedRpcResult(response)) {
    if (response.error) {
      throw new Error(response.error)
    }
    return response.result || null
  }

  return response || null
}

async function ethereumRequest(
  ethereum: EthereumProvider,
  method: string,
  params: string[]
): Promise<any> {
  // If ethereum.request() exists, the provider is probably EIP-1193 compliant.
  if (ethereum.request) {
    return ethereum.request({ method, params }).then(rpcResult)
  }
  
  // This is specific to some older versions of MetaMask combined with Web3.js.
  if (ethereum.sendAsync && ethereum.selectedAddress) {
    return new Promise((resolve, reject) => {
      ethereum.sendAsync(
        {
          method,
          params,
          from: ethereum.selectedAddress,
          jsonrpc: '2.0',
          id: 0,
        },
        (err: Error, result: any) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        }
      )
    }).then(rpcResult)
  }

  // If none of the previous two exist, we assume the provider is pre EIP-1193,
  // using .send() rather than .request().
  if (ethereum.send) {
    return ethereum.send(method, params).then(rpcResult)
  }

  throw new Error(
    'The Ethereum provider doesn’t seem to provide a request method.'
  )
}

export async function getAccountIsContract(
  ethereum: EthereumProvider,
  account: Account
): Promise<boolean> {
  try {
    const code = await ethereumRequest(ethereum, 'eth_getCode', [account])
    return code !== '0x'
  } catch (err) {
    return false
  }
}

export async function getAccountBalance(
  ethereum: EthereumProvider,
  account: Account
) {
  return ethereumRequest(ethereum, 'eth_getBalance', [account, 'latest'])
}

export async function getBlockNumber(ethereum: EthereumProvider) {
  return ethereumRequest(ethereum, 'eth_blockNumber', [])
}

export function pollEvery<R, T>(
  fn: (
    // As of TS 3.9, it doesn’t seem possible to specify dynamic params
    // as a generic type (e.g. using `T` here). Instead, we have to specify an
    // array in place (`T[]`), making it impossible to type params independently.
    ...params: T[]
  ) => {
    request: () => Promise<R>
    onResult: (result: R) => void
  },
  delay: number
) {
  let timer: any // can be TimeOut (Node) or number (web)
  let stop = false
  const poll = async (
    request: () => Promise<R>,
    onResult: (result: R) => void
  ) => {
    const result = await request()
    if (!stop) {
      onResult(result)
      timer = setTimeout(poll.bind(null, request, onResult), delay)
    }
  }
  return (...params: T[]) => {
    const { request, onResult } = fn(...params)
    stop = false
    poll(request, onResult)
    return () => {
      stop = true
      clearTimeout(timer)
    }
  }
}

export function getTokenBalance(tokenAddress: string, address: string, library: any) {
  if (!isAddress(tokenAddress) || !isAddress(address)) {
    throw Error(
      `Invalid 'tokenAddress' or 'address' parameter '${tokenAddress}' or '${address}'.`,
    )
  }
  return getContract(tokenAddress, ERC20_ABI_DEG, library).balanceOf(address)
}
export function getApproveBalance(contractAddress: string,ethereum: EthereumProvider,account: Account) {
  if (!isAddress(contractAddress) || !isAddress(account)) {
    throw Error(
      `Invalid 'tokenAddress' or 'address' parameter '${contractAddress}' or '${account}'.`,
    )
  }
  return getContract(contractAddress, ERC20_ABI_DEG , ethereum).allowance(account)
}
export function isAddress(address: string) {
  return ethers.utils.isAddress(address)
}

export function getContract(address: string, abi: string, library: any, account?: string) {
  if (!isAddress(address) || address === ethers.constants.AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  
  return new ethers.Contract(
    address,
    abi,
    getProviderOrSigner(library, account),
  )
}

export function getProviderOrSigner(library: any, account?: string) {
  return account
    ? new UncheckedJsonRpcSigner(library.getSigner(account))
    : library
}

export async function getGasPrice() {
  // @ts-ignore
  const web3URL = window.web3 ? window.web3.currentProvider : process.env.ETH_NODE_URL;
  const web3 = new Web3(web3URL);
  return await web3.eth.getGasPrice()
}


// 处理科学记数法转数字；
export const toNonExponential = (numStr: string) => {
  //这边看下你那边有没有指定格式，可能没有+，所以后面改成('E')就好了
  const temp: string[] = numStr.toUpperCase().split('E+')
  const tempReduce: string[] = numStr.toUpperCase().split('E-')
  if (!temp[1] && !tempReduce[1]) {
    return numStr
  } else {
    if (temp[1]) {
      const arr = temp[0].split('.')
      let tempNumStr = '1'
      let lengths = 0
      if (arr[1]) {
        tempNumStr = `${arr[0]}${arr[1]}`
        lengths = arr[1].length
      }
      for (let i = 0; i < parseInt(temp[1]) - lengths; i++) {
        tempNumStr += '0'
      }
      return tempNumStr
    } else {
      if (parseInt(tempReduce[1]) > 5) {
        return 0
      }
      let tempNumStr = '0.'
      for (let i = 0; i < parseInt(tempReduce[1]) - 1; i++) {
        tempNumStr += '0'
      }
      return tempNumStr + tempReduce[0]
    }
  }
}

export const mulDecimals = (
  amount: string | number,
  decimals: string | number,
) => {
  if (!Number(decimals)) {
    return new BN(amount);
  }
  const decimalsMul = `10${new Array(Number(decimals)).join('0')}`;
  const amountStr = new BigNumber(amount).multipliedBy(decimalsMul);
  return toNonExponential(amountStr.toString());
};

export const divDecimals = (
  amount: string | number,
  decimals: string | number,
) => {
  if (!Number(decimals)) {
    return new BN(amount);
  }
  const decimalsMul = `10${new Array(Number(decimals)).join('0')}`;
  const amountStr = new BigNumber(amount).dividedBy(decimalsMul);
  
  return amountStr.toFixed();
};

export const parsetBigNumber = (amount: any) => {
  if (!amount?._hex) {
    return 0
  }
  return new BigNumber(parseInt(amount?._hex, 16)).toFixed()
}

export const divDecimalsByBigNumber = (
  amount: any,
  decimals: string | number,
  rate?: number | string
) => {
  if (decimals === 0 && amount?._hex) {
    return new BigNumber(parseInt(amount?._hex, 16)).toFixed()
  }
  if (!Number(decimals)) {
    return new BN(amount);
  }
  if (!amount?._hex) {
    return 0
  }
  const decimalsMul = `10${new Array(Number(decimals)).join('0')}`;
  return (new BigNumber(parseInt(amount?._hex, 16)).div(new BigNumber(decimalsMul))).multipliedBy(rate??1).toFixed(18,1)
};

export function truncateAddressString(address: string, num = 4) {
  if (!address) {
    return '';
  }

  const first = address.slice(0, num);
  const last = address.slice(-num);
  return `${first}...${last}`;
}