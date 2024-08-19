import { ArgentWalletContract } from '../abis/types'
import { useContract } from './useContract'
import useIsArgentWallet from './useIsArgentWallet'
import ArgentWalletContractABI from '../abis/argent-wallet-contract.json'
import { useAccount } from 'wagmi'

export function useArgentWalletContract(): ArgentWalletContract | null {
  const { address: account } = useAccount();
  const isArgentWallet = useIsArgentWallet()
  return useContract(
    isArgentWallet ? account ?? undefined : undefined,
    ArgentWalletContractABI,
    true
  ) as ArgentWalletContract
}
