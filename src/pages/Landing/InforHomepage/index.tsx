import React from 'react'
import { Title, SwapAbout, Money, Bitcoin, ArrowGreen } from '../../../assets'
import styled from 'styled-components/macro'
import { BREAKPOINTS } from '../../../theme'
import { Link } from 'react-router-dom'
import BoxTokenPrice from './components/BoxTokenPrice'

export default function InforHomepage() {
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
  const PageContainer = styled.div`
    padding: 20px 12px;

    height: 100%;
    z-index: 2;

    @media screen and (min-width: ${BREAKPOINTS.sm}px) {
      max-width: 1288px;
    }
  `
  const Image = styled.img`
    width: 300px;

    @media screen and (min-width: ${BREAKPOINTS.sm}px) {
      width: 500px;
    }
  `
  const ImageSwap = styled.img`
    width: 356px;

    @media screen and (min-width: ${BREAKPOINTS.sm}px) {
      width: 500px;
    }
  `

  const GroupButton = styled.div`
    display: inline-flex;
    gap: 10px;
    @media screen and (min-width: ${BREAKPOINTS.sm}px) {
      gap: 4px;
    }
  `

  // const ValueToken = styled.div`
  //   align-items: center;

  //   background: rgba(255, 255, 255, 0.05);
  //   backdrop-filter: blur(5px);
  //   width: 100%;
  //   padding: 12px 16px;
  //   border-radius: 30px;
  //   justify-content: space-between;

  //   display: flex;
  //   flex-wrap: wrap;
  //   gap: 1.5rem;
  //   @media screen and (min-width: ${BREAKPOINTS.sm}px) {
  //     display: inline-flex;
  //   }
  // `
  const ContentContainer = styled.div<{}>``
  const AboutContentContainer = styled.div<{}>`
    @media screen and (min-width: ${BREAKPOINTS.sm}px) {
      display: inline-flex;
      padding-top: 60px;
      padding-bottom: 20px;
      gap: 10rem;
    }
  `
  const IntroContainer = styled.div`
    display: none;
    @media screen and (min-width: ${BREAKPOINTS.sm}px) {
      display: inline-flex;
      padding-top: 60px;
      padding-bottom: 20px;
      gap: 10rem;
    }
  `

  const AboutContent = styled.div`
    padding-top: 1rem;
    @media (min-width: 1024px) {
      padding-top: 4rem;
    }

    color: #f5f5f5;
    font-size: 16px;
    font-family: Inter;
    font-weight: 400;
    line-height: 24px;
    word-wrap: break-word;
  `
  const AboutContentTitle = styled.div`
    color: #f5f5f5;
    font-size: 28px;
    font-family: Inter;
    font-weight: 700;
    line-height: 24px;
    word-wrap: break-word;
  `
  const AboutContentText = styled.p`
    color: #7484b7;
    font-family: Inter;
    font-size: 15px;
    line-height: 24px;
    font-style: normal;
    font-weight: 400;
    @media screen and (min-width: ${BREAKPOINTS.sm}px) {
      font-size: 19.071px;
      line-height: 28.606px;
    }
  `
  const StyledGetStartedButton = styled(Link)`
    background: var(--Linear, linear-gradient(92deg, #ff4040 -15.65%, #56f 79.75%));
    display: flex;
    padding: 12px 40px;
    justify-content: center;
    align-items: center;

    border-radius: 43px;
    border: none;
    color: white;
    font-size: 16px;
    font-weight: 500;
    @media screen and (min-width: ${BREAKPOINTS.sm}px) {
      padding: 12px 28px;
    }
  `
  const StyledLearnMoreButton = styled.button`
    background: var(--ffc-85-f, rgba(117, 95, 255, 0.2));
    display: flex;
    padding: 12px 40px;
    justify-content: center;
    align-items: center;

    border-radius: 43px;
    border: none;
    color: white;
    font-size: 16px;
    font-weight: 500;
    @media screen and (min-width: ${BREAKPOINTS.sm}px) {
      padding: 12px 28px;
    }
  `

  return (
    <PageContainer>
      <ContentContainer>
        <AboutContentContainer>
          <AboutContent>
            <Image src={Title} alt="" />
            <AboutContentText>Swapping with the PookieSwap protocol is a permissionless process.</AboutContentText>
            <GroupButton>
              <StyledGetStartedButton to="/swap">Get Started</StyledGetStartedButton>
              <StyledLearnMoreButton>Learn More</StyledLearnMoreButton>
            </GroupButton>
          </AboutContent>
          <ImageSwap src={SwapAbout} alt="" />
        </AboutContentContainer>
        <BoxTokenPrice />
        {/* <ValueToken>
          {data.map((item) => (
            <div
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                display: 'inline-flex',
                gap: 12,
                width: '140px',
              }}
              key={item.id}
            >
              <img style={{ width: 30, height: 30, borderRadius: 99 }} src={item.iconToken} alt={item.symbol} />
              <div style={{}}>
                <div style={{ display: 'inline-flex' }}>
                  <span
                    style={{
                      color: '#F1F1F1',
                      fontSize: 16,
                      fontFamily: 'Inter',
                      fontWeight: 600,
                    }}
                  >
                    {item.symbol}
                  </span>
                  <div style={{ position: 'relative' }}>
                    <span
                      style={{
                        left: 18,
                        top: 0,
                        position: 'absolute',
                        textAlign: 'right',
                        color: '#00E85D',
                        fontSize: 14,
                        fontFamily: 'Inter',
                        fontWeight: 400,
                      }}
                    >
                      {item.percentage}
                    </span>
                    <img style={{ position: 'relative' }} src={item.arrowicon} />
                  </div>
                </div>
                <div
                  style={{
                    color: '#F1F1F1',
                    fontSize: 14,
                    fontFamily: 'Inter',
                    fontWeight: 400,
                  }}
                >
                  {item.amount}
                </div>
              </div>
            </div>
          ))}
        </ValueToken> */}
        <IntroContainer>
          <img src={Money} alt="" />

          <div style={{ paddingTop: '1.5rem' }}>
            <AboutContentTitle>What Is PookieSwap (VRA)?</AboutContentTitle>
            <p
              style={{
                color: '#787878',
                fontSize: 16,
                fontFamily: 'Inter',
                fontWeight: 400,
                lineHeight: 2,
              }}
            >
              Swaps are the most common way of interacting with the PookieSwap protocol. For end-users, swapping is
              straightforward: a user selects an ERC-20 token that they own and a token they would like to trade it for.
              Executing a swap sells the currently owned tokens for the proportional amount of the desired tokens, minus
              the swap fee, which is awarded to liquidity providers. Swapping with the PookieSwap protocol is a
              permissionless process.
            </p>

            <StyledLearnMoreButton>Learn More</StyledLearnMoreButton>
          </div>
        </IntroContainer>
      </ContentContainer>
    </PageContainer>
  )
}
