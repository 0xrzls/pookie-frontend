import { SupportedChainId } from '../constants/chains'

const MAINNET_AND_TESTNETS = [
  SupportedChainId.KAKAROT,
  SupportedChainId.MAINNET,
  SupportedChainId.GOERLI,
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.ARBITRUM_RINKEBY,
  SupportedChainId.KOVAN,
  SupportedChainId.OPTIMISM,
  SupportedChainId.OPTIMISTIC_KOVAN,
  SupportedChainId.RINKEBY,
  SupportedChainId.ROPSTEN,
]

export function constructSameAddressMap<T extends string>(
  address: T,
  additionalNetworks: SupportedChainId[] = []
): { [chainId: number]: T } {
  return MAINNET_AND_TESTNETS.concat(additionalNetworks).reduce<{ [chainId: number]: T }>((memo, chainId) => {
    memo[chainId] = address
    return memo
  }, {})
}
