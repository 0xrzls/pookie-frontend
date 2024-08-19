import { useMemo } from 'react'
import { NEVER_RELOAD, useSingleCallResult } from '../state/multicall/hooks'
import { useArgentWalletDetectorContract } from './useContract'
import { useAccount } from 'wagmi'

export default function useIsArgentWallet(): boolean {
  const { address: account } = useAccount();
  const argentWalletDetector = useArgentWalletDetectorContract()
  const inputs = useMemo(() => [account ?? undefined], [account])
  const call = useSingleCallResult(argentWalletDetector, 'isArgentWallet', inputs, NEVER_RELOAD)
  return call?.result?.[0] ?? false
}
