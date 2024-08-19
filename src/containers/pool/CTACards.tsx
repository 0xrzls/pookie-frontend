import React from 'react'
import { IconExport } from 'assets'
import { AutoColumn } from 'components/Column'
import styled, { ThemeContext } from 'styled-components/macro'

import { ExternalLink } from 'theme/components'

const CTASection = styled.section`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 24px;
`

const CTA = styled(ExternalLink)`
  padding: 16px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  background: rgba(117, 95, 255, 0.2);

  * {
    text-decoration: none !important;
  }

  :hover {
    text-decoration: none;
    * {
      text-decoration: none !important;
    }
  }
`

const HeaderText = styled.div`
  align-items: center;
  color: white;
  display: flex;
  font-size: 18px;
  font-weight: 535 !important;
  gap: 12px;
`

const ResponsiveColumn = styled(AutoColumn)`
  grid-template-columns: 1fr;
  width: 100%;
  gap: 8px;

  justify-content: space-between;
`

const CTACards = () => {
  return (
    <CTASection>
      <CTA
        style={{
          gridColumn: ' span 2 / span 2',
        }}
        data-testid="cta-infolink"
        href=""
      >
        <ResponsiveColumn>
          <HeaderText style={{ alignSelf: 'flex-start' }}>
            <span>Top pools</span>
            <IconExport size="20" />
          </HeaderText>
          <div style={{ alignSelf: 'flex-start', fontWeight: 485, color: 'rgba(255, 255, 255, 0.40)' }}>
            <span>Explore Uniswap Analytics.</span>
          </div>
        </ResponsiveColumn>
      </CTA>
      <CTA
        style={{
          gridColumn: ' span 3 / span 3',
        }}
        href="https://support.uniswap.org/hc/en-us/categories/8122334631437-Providing-Liquidity-"
      >
        <ResponsiveColumn>
          <HeaderText>
            <span>Learn about providing liquidity</span>
            <IconExport size="20" />
          </HeaderText>
          <div style={{ alignItems: 'center', display: 'flex', fontWeight: 485, color: 'rgba(255, 255, 255, 0.40)' }}>
            <span>Check out our v3 LP walkthrough and migration guides.</span>
          </div>
        </ResponsiveColumn>
      </CTA>
    </CTASection>
  )
}

export default CTACards
