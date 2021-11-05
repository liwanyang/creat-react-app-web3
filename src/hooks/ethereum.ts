import { useMemo  } from 'react'
import { useWeb3React } from '@web3-react/core'
import { getContract } from '../use-wallet/utils'

export function useContract(address: string, abi: any, withSignerIfPossible = true) {
  const { account, library } = useWeb3React()

  return useMemo(() => {
    try {
      return getContract(
        address,
        abi,
        library,
        withSignerIfPossible ? account || undefined : undefined,
      )
    } catch {
      return null
    }
  }, [address, abi, library, account, withSignerIfPossible])
}
