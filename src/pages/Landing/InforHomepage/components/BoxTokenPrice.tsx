/* eslint-disable react/no-array-index-key */
import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import styled from 'styled-components/macro'
import { useResizeDetector } from 'react-resize-detector'
import chunk from 'lodash/chunk'
import useMatchBreakpoints from 'hooks/useMatchBreakpoints'
import CurrencyLogoWithAddress from 'components/Logo/CurrencyLogoWithAddress'
import Box from './Box'
import Flex from './Flex'

const listTokenKakarot = [{ address: '0x761612F0C8bdf8cF10e6F10045E2Ca7cbffBa8A3', symbol: 'ETH', order: 2 }]
const listTokenEth: any = [
  // { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', symbol: 'BTC', order: 1 },
  // { address: '0x418D75f65a02b3D53B2418FB8E1fe493759c7605', symbol: 'BNB', order: 4 },
  // {
  //   address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  //   symbol: 'USDC',
  //   order: 5,
  // },
]

type TokenInfoType = {
  address: string
  usd: number
  usd24hChange: number
  symbol: string
  order: number
}
const SlideShowSlider = styled(Box)`
  white-space: nowrap;
  transition: ease 1000ms;
`
const SlideShow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  column-gap: 32px;
  row-gap: 16px;

  @media screen and (min-width: 1024px) {
    justify-content: space-between;
  }
`
// const Slide = styled.div`
//   white-space: nowrap;
//   transition: ease 1000ms;
// `

const ChangeText = styled.span<{ positive: boolean }>`
  color: ${({ positive }) => (positive ? '#00e85d' : '#ff4567')};
  font-family: 'Inter';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  margin-left: 4px;
`
const SymbolText = styled.span`
  color: var(--f-1-f-1-f-1, #f1f1f1);
  font-family: 'Inter';
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
`
const PriceText = styled.span`
  color: var(--f-1-f-1-f-1, #f1f1f1);
  font-family: 'Inter';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  margin-top: 4px;
`

// https://api.coingecko.com/api/v3/simple/token_price/mantle?contract_addresses=0xD67de0e0a0Fd7b15dC8348Bb9BE742F3c5850454%2C0x74b23882a30290451A17c44f4F05243b6b58C76d&vs_currencies=usd&include_24hr_change=true
const BoxTokenPrice = () => {
  const { ref } = useResizeDetector()

  const [state, setState] = useState<TokenInfoType[]>([])
  const { isMobile, isTablet } = useMatchBreakpoints()
  const isSmallerScreen = isMobile || isTablet

  const chunkState = useMemo(() => chunk(state, 5), [state])

  const getTokenInfo = async (listToken: typeof listTokenKakarot, network: string): Promise<TokenInfoType[]> => {
    try {
      const contractAddresses = listToken.map((_token) => _token.address).join(',')

      const res = await axios.get(
        `https://api.coingecko.com/api/v3/simple/token_price/${network}?contract_addresses=${contractAddresses}&vs_currencies=usd&include_24hr_change=true`
      )
      const listTokenWithOrderInfo: TokenInfoType[] = Object.entries<any>(res?.data || {}).map(
        ([address, { usd, usd_24h_change: usd24hChange }]) => {
          //  symbol: listTokenWithOrder.find((_t) => _t.address === address).symbol
          const token = listToken.find((_t) => {
            return _t.address.toLocaleLowerCase() === address
          })

          return {
            address: token?.address || '',
            usd,
            usd24hChange,
            symbol: token?.symbol || '',
            order: token?.order || 0,
          }
        }
      )

      return listTokenWithOrderInfo
    } catch (err) {
      console.error(err)
      return []
    }
  }

  useEffect(() => {
    const getAllTokenInfo = () =>
      Promise.all([getTokenInfo(listTokenKakarot, 'kakarot'), getTokenInfo(listTokenEth, 'ethereum')]).then(
        ([_listFtm, _listEth]) => {
          const listToken = [..._listFtm, ..._listEth]
          setState(listToken.sort((_tokenA, _tokenB) => _tokenA.order - _tokenB.order))
        }
      )
    getAllTokenInfo()
    const interval = setInterval(getAllTokenInfo, 60000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  function renderTokenPriceInfo(_token: TokenInfoType) {
    const isPositive = _token.usd24hChange > 0

    return (
      <Flex alignItems="center" key={_token.address} justifyContent="center">
        <CurrencyLogoWithAddress size="48px" address={_token.address} />
        <Box ml="12px">
          <Flex>
            <SymbolText>{_token.symbol}</SymbolText>
            <ChangeText positive={isPositive}>
              {_token?.usd24hChange?.toLocaleString(undefined, { maximumFractionDigits: 2 })}%
            </ChangeText>
          </Flex>
          <PriceText>${_token?.usd?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</PriceText>
        </Box>
      </Flex>
    )
  }

  return (
    <SlideShowSlider
      borderRadius="25px"
      mb={10}
      pb="12px"
      pt="12px"
      pl="16px"
      pr="16px"
      background="rgba(255, 255, 255, 0.05)"
      height={isSmallerScreen ? 'auto' : '72px'}
      style={{ overflow: 'hidden' }}
      ref={ref}
    >
      {chunkState.map((_5item, _index) => {
        return <SlideShow key={_index}>{_5item.map(renderTokenPriceInfo)}</SlideShow>
      })}
      {/* <SlideShow key={1} >
          {state.slice(0, 5).map(renderTokenPriceInfo)}
        </SlideShow>
        <SlideShow key={2} >
          {state.slice(5, 10).map(renderTokenPriceInfo)}
        </SlideShow>
        <SlideShow key={3} >
          {state.slice(10, 15).map(renderTokenPriceInfo)}
        </SlideShow>
        <SlideShow key={4} >
          {state.slice(15, 20).map(renderTokenPriceInfo)}
        </SlideShow>
        <SlideShow key={5} >
          {state.slice(20, -1).map(renderTokenPriceInfo)}
        </SlideShow> */}
    </SlideShowSlider>
  )
}

export default BoxTokenPrice
