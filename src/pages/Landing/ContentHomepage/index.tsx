import React from 'react'
import {
  totalvolume,
  user,
  volume24h,
  earned,
  feesaved,
  Bitcoin,
  ArrowGreen,
  OptionSwap,
  OptionLaunch,
  benefit1,
  benefit2,
  benefit3,
  benefit4,
} from '../../../assets'
import styled from 'styled-components/macro'
import { BREAKPOINTS } from '../../../theme'

export default function ContentHomepage() {
  const data = [
    {
      id: 1,
      symbol: 'BTC',
      iconToken: Bitcoin,
      percentage: '1.44%',
      arrowicon: ArrowGreen,
      amount: '37,505.05$',
    },
    {
      id: 2,
      symbol: 'BTC',
      iconToken: Bitcoin,
      percentage: '1.44%',
      arrowicon: ArrowGreen,
      amount: '37,505.05$',
    },
    {
      id: 3,
      symbol: 'BTC',
      iconToken: Bitcoin,
      percentage: '1.44%',
      arrowicon: ArrowGreen,
      amount: '37,505.05$',
    },
    {
      id: 4,
      symbol: 'BTC',
      iconToken: Bitcoin,
      percentage: '1.44%',
      arrowicon: ArrowGreen,
      amount: '37,505.05$',
    },
    {
      id: 5,
      symbol: 'BTC',
      iconToken: Bitcoin,
      percentage: '1.44%',
      arrowicon: ArrowGreen,
      amount: '37,505.05$',
    },
    {
      id: 6,
      symbol: 'BTC',
      iconToken: Bitcoin,
      percentage: '1.44%',
      arrowicon: ArrowGreen,
      amount: '37,505.05$',
    },
  ]

  const dataMenuOptions = [
    {
      id: 1,
      title: 'Swap Token',
      content: 'Buy, sell, and explore tokens on Kakarot zkEVM.',
      button: 'Trade token',
      bg: OptionSwap,
    },
    {
      id: 2,
      title: 'Launchpools',
      content: 'Provide liquidity for tokens on Kakarot zkEVM.',
      button: 'Add liquidity',
      bg: OptionLaunch,
    },
  ]
  const dataListBenefits = [
    {
      id: 1,
      image: benefit1,
      title: 'Introduction',
      content:
        'Swaps using the PookieSwap protocol are different from traditional order book trades in that they are not executed against discrete orders on a first-in-first-out basis — rather, swaps execute against a passive pool of liquidity, with liquidity providers earning fees proportional to their capital committed.',
    },
    {
      id: 2,
      image: benefit2,
      title: 'Price Impact',
      content:
        'Approximate price impact is anticipated in real-time via the PookieSwap interface, and warnings appear if unusually high price impact will occur during a swap. Anyone executing a swap will have the ability to assess the circumstances of price impact when needed.',
    },
    {
      id: 3,
      image: benefit3,
      title: 'Slippage',
      content:
        'The other relevant detail to consider when approaching swaps with the PookieSwap protocol is slippage. Slippage is the term we use to describe alterations to a given price that could occur while a submitted transaction is pending.',
    },
    {
      id: 4,
      image: benefit4,
      title: 'Safety Checks',
      content:
        'Price impact and slippage can both change while a transaction is pending, which is why we have built numerous safety checks into the PookieSwap protocol to protect end-users from drastic changes in the execution environment of their swap.',
    },
  ]
  const dataStatisticalList = [
    {
      id: 1,
      image: totalvolume,
      title: 'Total Volume',
      value: '$300.52M',
    },
    {
      id: 2,
      image: volume24h,
      title: 'Volume 24h',
      value: '$1.55M',
    },
    {
      id: 3,
      image: user,
      title: 'Monthly active users',
      value: '50.53K',
    },
    {
      id: 4,
      image: feesaved,
      title: 'Trade Fee Saved',
      value: '$4.63M',
    },
    {
      id: 5,
      image: earned,
      title: 'LP Earned',
      value: '$16.56M',
    },
  ]

  const PageContainer = styled.div`
    z-index: 3;

    background: #eef1fb;
    display: flex;
    justify-content: center;

    @media screen and (min-width: ${BREAKPOINTS.sm}px) {
      width: 100%;
      margin: 0 auto;
    }
  `

  const ContentHomepage = styled.div`
    padding: 32px 12px;
    max-width: 1288px;
  `
  const TitleOption = styled.div`
    color: #081832;
    font-size: 24px;
    font-family: Inter;
    font-weight: 700;
    line-height: 36px;
    word-wrap: break-word;
    padding-bottom: 10px;
  `

  const MenuOption = styled.div`
    @media screen and (min-width: ${BREAKPOINTS.sm}px) {
      justify-content: space-between;
      display: inline-flex;
      gap: 4rem;
    }
  `

  const BoxOption = styled.div`
    position: relative;
    background: white;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    width: 375px;
    margin-bottom: 32px;
    @media screen and (min-width: ${BREAKPOINTS.sm}px) {
      width: 600px;
    }
  `
  const BackgroundBoxOption = styled.div`
    position: relative;
    background: linear-gradient(90deg, white 30%, rgba(217, 217, 217, 0) 100%);
    border-radius: 12px;
    position: absolute;
    width: 375px;
    height: 180px;

    @media screen and (min-width: ${BREAKPOINTS.sm}px) {
      width: 600px;
      height: 280px;
    }
  `
  const ImageOption = styled.img`
    border-radius: 12px;

    width: 375px;
    height: 180px;

    @media screen and (min-width: ${BREAKPOINTS.sm}px) {
      width: 600px;
      height: 280px;
    }
  `

  const ContentOption = styled.div`
    color: #1e1e1e;
    font-size: 16px;
    font-family: Inter;
    font-weight: 400;
    line-height: 24px;
    word-wrap: break-word;
    position: absolute;
    top: 50px;
    left: 20px;
    width: 220px;
    @media screen and (min-width: ${BREAKPOINTS.sm}px) {
      top: 140px;

      width: 330px;
    }
  `

  const ButtonOption = styled.button`
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 8px;
    padding-bottom: 8px;
    background: rgba(117.4, 95, 255, 0.2);
    border-radius: 999px;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 8px;
    display: inline-flex;
    color: #3f3cff;
    font-size: 16px;
    font-family: Inter;
    font-weight: 600;
    border: none;
    margin-top: 12px;
  `
  const Benefits = styled.div`
    width: 100%;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 48px;
    display: inline-flex;
    padding: 22px 0;
  `
  const ListBenefits = styled.div`
    display: none;
    @media screen and (min-width: ${BREAKPOINTS.sm}px) {
      width: 100%;
      justify-content: space-between;
      display: inline-flex;
      gap: 8px;
    }
  `

  const TitleBenefits = styled.span`
    color: #081832;
    font-size: 18px;
    font-family: Inter;
    font-weight: 700;
    line-height: 26px;
    word-wrap: break-word;
  `
  const ContentBenefits = styled.span`
    color: #787878;
    font-size: 14px;
    font-family: Inter;
    font-weight: 400;
    line-height: 20px;
    word-wrap: break-word;
    align-self: stretch;
    text-align: center;
  `

  const StatisticalList = styled.div`
    width: 100%;
    padding-left: 40px;
    padding-right: 40px;

    padding-top: 24px;
    padding-bottom: 24px;
    background: rgba(95, 139.8, 255, 0.05);
    border-radius: 24px;
    justify-content: space-between;
    align-items: center;

    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;

    @media screen and (min-width: ${BREAKPOINTS.sm}px) {
      display: inline-flex;
      gap: 32px;
      padding-left: 72px;
      padding-right: 72px;
    }
  `
  const TitleSatisticalist = styled.span`
    color: #081832;
    font-size: 14px;
    font-family: Inter;
    font-weight: 500;
    line-height: 20px;
    word-wrap: break-word;
  `
  const ValueSatisticalist = styled.span`
    color: #1e1e1e;
    font-size: 18px;
    font-family: Inter;
    font-weight: 700;
    line-height: 26px;
    word-wrap: break-word;
  `

  const MobileBenefits = styled.div`
    display: flex;

    @media screen and (min-width: ${BREAKPOINTS.sm}px) {
      display: none;
    }
  `
  return (
    <PageContainer>
      <ContentHomepage>
        <MenuOption>
          {dataMenuOptions.map((item) => (
            <div key={item.id}>
              <TitleOption>{item.title}</TitleOption>
              <BoxOption>
                <div style={{}}>
                  <BackgroundBoxOption></BackgroundBoxOption>
                  <ImageOption src={item.bg} />
                </div>
                <ContentOption>
                  {item.content}
                  <ButtonOption>{item.button}</ButtonOption>
                </ContentOption>
              </BoxOption>
            </div>
          ))}
        </MenuOption>
        <Benefits>
          <TitleOption>Our Benefits</TitleOption>
          <ListBenefits>
            {dataListBenefits.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: '20px',
                }}
              >
                <img src={item.image} />
                <TitleBenefits>{item.title}</TitleBenefits>
                <ContentBenefits>{item.content}</ContentBenefits>
              </div>
            ))}
          </ListBenefits>

          <MobileBenefits>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <img src={benefit1} />
              <TitleBenefits>{dataListBenefits[0].title}</TitleBenefits>
              <ContentBenefits>{dataListBenefits[0].content}</ContentBenefits>
            </div>
          </MobileBenefits>
        </Benefits>
        <StatisticalList>
          {dataStatisticalList.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '20px',
                minWidth: '130px',
              }}
            >
              <img src={item.image} />
              <TitleSatisticalist>{item.title}</TitleSatisticalist>
              <ValueSatisticalist>{item.value}</ValueSatisticalist>
            </div>
          ))}
        </StatisticalList>
      </ContentHomepage>
    </PageContainer>
  )
}
