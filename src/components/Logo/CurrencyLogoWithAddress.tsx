import React from 'react'
import styled from 'styled-components/macro'
import Logo from './index'

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`

export default function CurrencyLogoWithAddress({
  address,
  size = '48px',
  style,
  symbol,
}: {
  address: string
  size?: string
  symbol?: string
  style?: React.CSSProperties
}) {
  const srcs = [`images/tokens/${address}.png`, `/images/tokens/${address}.png`]
  return <StyledLogo size={size} srcs={srcs} alt={`${symbol ?? 'token'} logo`} style={style} />
}
