import React from 'react'
import { binancelab, zk, kucoin, ventures, certik, binance } from '../../../assets'
import styled from 'styled-components/macro'
import { BREAKPOINTS } from '../../../theme'

const PARTNER_ICON = [zk, kucoin, ventures, certik, binance]

export default function AboutHomepage() {
  const PageContainer = styled.div`
    width: 100%;

    display: flex;
    justify-content: center;
    z-index: 3;
    margin: 0 auto;
    background: linear-gradient(180deg, #081832 0%, #103071 100%);
    @media screen and (min-width: ${BREAKPOINTS.sm}px) {
      padding: 8rem 120px;
    }
  `
  const AboutHomepage = styled.div`
    padding: 20px 12px;
    width: 100%;
    @media screen and (min-width: ${BREAKPOINTS.sm}px) {
      max-width: 1288px;
    }
  `
  const Investor = styled.div`
    width: 100%;
    padding: 32px;
    background: linear-gradient(92deg, #ff4040 0%, #5566ff 100%);
    border-radius: 32px;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 20px;

    @media screen and (min-width: ${BREAKPOINTS.sm}px) {
      display: inline-flex;
    }
  `
  const InvestorBox = styled.div`
    width: 100%;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 20px;
    display: inline-flex;
  `
  const InvestorTitle = styled.span`
    color: white;
    font-size: 32px;
    font-family: Inter;
    font-weight: 700;
    line-height: 48px;
    word-wrap: break-word;
  `
  const InvestorContent = styled.span`
    color: #f5f5f5;
    font-size: 14px;
    font-family: Inter;
    font-weight: 400;
    line-height: 20px;
    word-wrap: break-word;
  `
  const InvestorButton = styled.button`
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    padding: 12px 28px;
    justify-content: center;
    align-items: center;

    border-radius: 43px;
    border: none;
    color: white;
    font-size: 16px;
    font-weight: 600;
  `
  const ImageInvestor = styled.img`
    width: 286px;

    @media screen and (min-width: ${BREAKPOINTS.sm}px) {
      width: 440px;
    }
  `

  const Partners = styled.div`
    width: 100%;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 48px;
    display: inline-flex;
    padding: 4rem 0;
  `
  const ListPartners = styled.div`
    display: none;

    @media screen and (min-width: ${BREAKPOINTS.sm}px) {
      width: 100%;
      justify-content: space-between;
      display: inline-flex;
    }
  `

  return (
    <PageContainer>
      <AboutHomepage>
        <Investor>
          <InvestorBox>
            <InvestorTitle>Our Strategic Investor</InvestorTitle>
            <InvestorContent>Investments are the key piece of any financial planning puzzle.</InvestorContent>
            <InvestorButton>Get started</InvestorButton>
          </InvestorBox>
          {/* <ImageInvestor src={binancelab} /> */}
        </Investor>
        {/* <Partners>
          <InvestorTitle>Partners</InvestorTitle>
          <ListPartners>
            {PARTNER_ICON.map((partner) => (
              <img src={partner} key={partner} />
            ))}
          </ListPartners>
        </Partners> */}
      </AboutHomepage>
    </PageContainer>
  )
}
