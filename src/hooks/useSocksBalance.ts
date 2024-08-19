import { useMemo } from 'react'
import { useTokenBalance } from 'state/wallet/hooks'
import { SOCKS_CONTROLLER_ADDRESSES } from 'constants/addresses'
import { Token } from 'dependencies/sdk-core'
import { SupportedChainId } from 'constants/chains'
import { useAccount, useChainId } from 'wagmi'

// technically a 721, not an ERC20, but suffices for our purposes
const SOCKS = new Token(SupportedChainId.KAKAROT, SOCKS_CONTROLLER_ADDRESSES[SupportedChainId.KAKAROT], 0)

export function useHasSocks(): boolean | undefined {
  const chainId = useChainId()
  const { address: account } = useAccount()

  const balance = useTokenBalance(account ?? undefined, chainId === SupportedChainId.KAKAROT ? SOCKS : undefined)

  return useMemo(() => Boolean(balance?.greaterThan(0)), [balance])
}
