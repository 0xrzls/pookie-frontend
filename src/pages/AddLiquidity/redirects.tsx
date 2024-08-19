import { Redirect, RouteComponentProps } from 'react-router-dom'
import { WETH9_EXTENDED } from '../../constants/tokens'
import AddLiquidity from './index'
import { useChainId } from 'wagmi';

export function RedirectDuplicateTokenIds(
  props: RouteComponentProps<{ currencyIdA: string; currencyIdB: string; feeAmount?: string }>
) {
  const {
    match: {
      params: { currencyIdA, currencyIdB },
    },
  } = props

  const chainId = useChainId();

  // prevent weth + eth
  const isETHOrWETHA =
    currencyIdA === 'ETH' || (chainId !== undefined && currencyIdA === WETH9_EXTENDED[chainId]?.address)
  const isETHOrWETHB =
    currencyIdB === 'ETH' || (chainId !== undefined && currencyIdB === WETH9_EXTENDED[chainId]?.address)

  if (
    currencyIdA &&
    currencyIdB &&
    (currencyIdA.toLowerCase() === currencyIdB.toLowerCase() || (isETHOrWETHA && isETHOrWETHB))
  ) {
    return <Redirect to={`/add/${currencyIdA}`} />
  }
  return <AddLiquidity {...props} />
}
