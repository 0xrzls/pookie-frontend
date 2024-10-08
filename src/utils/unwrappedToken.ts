import { Currency } from 'dependencies/sdk-core'
import { ExtendedEther, WETH9_EXTENDED } from '../constants/tokens'
import { supportedChainId } from './supportedChainId'

export function unwrappedToken(currency: Currency): Currency {
  if (currency.isNative) return currency
  const formattedChainId = supportedChainId(currency.chainId)
  if (formattedChainId && currency.equals(WETH9_EXTENDED[formattedChainId]))
    return ExtendedEther.onChain(currency.chainId)
  return currency
}
