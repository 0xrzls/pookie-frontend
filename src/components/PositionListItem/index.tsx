import { useMemo } from 'react'
import { Position } from 'dependencies/v3-sdk'
import Badge from 'components/Badge'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { usePool } from 'hooks/usePools'
import { useToken } from 'hooks/Tokens'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'
import { MEDIA_WIDTHS } from 'theme'
import { PositionDetails } from 'types/position'
import { Price, Token, Percent } from 'dependencies/sdk-core'
import { formatTickPrice } from 'utils/formatTickPrice'
import Loader from 'components/Loader'
import { unwrappedToken } from 'utils/unwrappedToken'
import RangeBadge from 'components/Badge/RangeBadge'
import { USDC_KAKAROT, USDT_KAKAROT, WETH9_EXTENDED } from '../../constants/tokens'

import useIsTickAtLimit from 'hooks/useIsTickAtLimit'
import { Bound } from 'state/mint/v3/actions'
import { Box, Text } from 'rebass'

const LinkRow = styled(Link)`
  align-items: center;
  border-radius: 20px;
  display: flex;
  cursor: pointer;
  user-select: none;
  justify-content: space-between;
  color: ${({ theme }) => theme.text1};
  margin: 8px 0;
  padding: 16px;
  text-decoration: none;
  font-weight: 500;
  /* background-color: ${({ theme }) => theme.bg1}; */
  background-color: #f5f5f5;

  &:first-of-type {
    margin: 0 0 8px 0;
  }
  &:last-of-type {
    margin: 8px 0 0 0;
  }
  & > div:not(:first-child) {
    text-align: right;
  }
  /* :hover {
    background-color: ${({ theme }) => theme.bg2};
  } */
  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    flex-direction: column;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `};
`

const BadgeText = styled.div`
  font-weight: 500;
  font-size: 14px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 12px;
  `};
`

const DataLineItem = styled.div`
  font-size: 14px;
`

const RangeLineItem = styled(DataLineItem)`
  /* display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end; */

  display: grid;
  width: 100%;
  gap: 24px;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
  row-gap: 4px;
`};
`

const DoubleArrow = styled.span`
  margin: 0 2px;
  color: ${({ theme }) => theme.text3};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 4px;
    padding: 20px;
  `};
`

const RangeText = styled.span`
  /* background-color: ${({ theme }) => theme.bg2}; */
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  background-color: white;
  gap: 8px;
  padding: 8px;
  display: flex;
  align-items: center;
  flex-direction: column;
`

const ExtentsText = styled.span`
  color: ${({ theme }) => theme.text3};
  font-size: 14px;
  margin-right: 4px;
`

const PrimaryPositionIdData = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  > * {
    margin-right: 4px;
    @media only screen and (min-width: 1024px) {
      margin-right: 8px;
    }
  }
`

const DataText = styled.div`
  font-weight: 600;
  font-size: 20px;
  color: #1e1e1e;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 14px;
  `};

  @media only screen and (max-width: 480px) {
    font-size: 18px;
  }
`

interface PositionListItemProps {
  positionDetails: PositionDetails
}

export function getPriceOrderingFromPositionForUI(position?: Position): {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  quote?: Token
  base?: Token
} {
  if (!position) {
    return {}
  }

  const token0 = position.amount0.currency
  const token1 = position.amount1.currency

  // if token0 is a dollar-stable asset, set it as the quote token
  const stables = [USDC_KAKAROT, USDT_KAKAROT]
  if (stables.some((stable) => stable.equals(token0))) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    }
  }

  // if token1 is an ETH-/BTC-stable asset, set it as the base token
  const bases = [...Object.values(WETH9_EXTENDED)]
  if (bases.some((base) => base.equals(token1))) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    }
  }

  // if both prices are below 1, invert
  if (position.token0PriceUpper.lessThan(1)) {
    return {
      priceLower: position.token0PriceUpper.invert(),
      priceUpper: position.token0PriceLower.invert(),
      quote: token0,
      base: token1,
    }
  }

  // otherwise, just return the default
  return {
    priceLower: position.token0PriceLower,
    priceUpper: position.token0PriceUpper,
    quote: token1,
    base: token0,
  }
}

export default function PositionListItem({ positionDetails }: PositionListItemProps) {
  const {
    token0: token0Address,
    token1: token1Address,
    fee: feeAmount,
    liquidity,
    tickLower,
    tickUpper,
  } = positionDetails

  const token0 = useToken(token0Address)
  const token1 = useToken(token1Address)

  const currency0 = token0 ? unwrappedToken(token0) : undefined
  const currency1 = token1 ? unwrappedToken(token1) : undefined

  // construct Position from details returned
  const [, pool] = usePool(currency0 ?? undefined, currency1 ?? undefined, feeAmount)

  const position = useMemo(() => {
    if (pool) {
      return new Position({ pool, liquidity: liquidity.toString(), tickLower, tickUpper })
    }
    return undefined
  }, [liquidity, pool, tickLower, tickUpper])

  const tickAtLimit = useIsTickAtLimit(feeAmount, tickLower, tickUpper)

  // prices
  const { priceLower, priceUpper, quote, base } = getPriceOrderingFromPositionForUI(position)

  const currencyQuote = quote && unwrappedToken(quote)
  const currencyBase = base && unwrappedToken(base)

  // check if price is within range
  const outOfRange: boolean = pool ? pool.tickCurrent < tickLower || pool.tickCurrent >= tickUpper : false

  const positionSummaryLink = '/pool/' + positionDetails.tokenId

  const removed = liquidity?.eq(0)

  return (
    <LinkRow to={positionSummaryLink}>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: '24px',
        }}
      >
        <PrimaryPositionIdData>
          <DoubleCurrencyLogo currency0={currencyBase} currency1={currencyQuote} size={26} margin />
          <DataText>
            &nbsp;{currencyQuote?.symbol}&nbsp;/&nbsp;{currencyBase?.symbol}
          </DataText>
          &nbsp;
          <Badge
            style={{
              backgroundColor: 'rgba(0, 183, 73, 0.10)',
              color: '#00B749',
              borderRadius: '99px',
            }}
          >
            <BadgeText>
              <span>{new Percent(feeAmount, 1_000_000).toSignificant()}%</span>
            </BadgeText>
          </Badge>
        </PrimaryPositionIdData>
        <RangeBadge removed={removed} inRange={!outOfRange} />
      </Box>

      {priceLower && priceUpper ? (
        <RangeLineItem>
          <RangeText>
            <ExtentsText color="#787878">
              <span>Min price</span>
            </ExtentsText>
            <Text
              style={{
                flex: '1 1 0%',
              }}
              color={'#1E1E1E'}
              fontSize={24}
              fontWeight={500}
              textAlign={'center'}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              {formatTickPrice(priceLower, tickAtLimit, Bound.LOWER)}
            </Text>
            <Box display={'flex'} alignItems={'center'} style={{ gap: '4px' }} color={'#787878'}>
              <Text>{currencyQuote?.symbol}</Text> per <Text>{currencyBase?.symbol ?? ''}</Text>
            </Box>
          </RangeText>{' '}
          <RangeText>
            <ExtentsText>
              <span>Max price</span>
            </ExtentsText>
            <Text
              style={{
                flex: '1 1 0%',
              }}
              color={'#1E1E1E'}
              fontSize={24}
              fontWeight={500}
              textAlign={'center'}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              {formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER)}
            </Text>
            <Box display={'flex'} alignItems={'center'} style={{ gap: '4px' }} color={'#787878'}>
              <Text>{currencyQuote?.symbol}</Text> per <Text>{currencyBase?.symbol ?? ''}</Text>
            </Box>
            {/* <span>
              {formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER)} <HoverInlineText text={currencyQuote?.symbol} />{' '}
              per <HoverInlineText maxCharacters={10} text={currencyBase?.symbol} />
            </span> */}
          </RangeText>
        </RangeLineItem>
      ) : (
        <Loader />
      )}
    </LinkRow>
  )
}
