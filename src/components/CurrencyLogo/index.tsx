import { Currency } from 'dependencies/sdk-core'
import React, { useMemo } from 'react'
import styled from 'styled-components/macro'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo'
import Logo from '../Logo'

export const getTokenLogoURL = (symbol: string) => `https://token-list.mantle.xyz/data/${symbol}/logo.png`

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.white};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
  ...rest
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (!currency || currency.isNative) return []

    if (currency.isToken) {
      const defaultUrls = currency.chainId === 1802203764 ? [getTokenLogoURL(currency.symbol ?? '')] : []
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, ...defaultUrls]
      }

      return defaultUrls
    }

    return []
  }, [currency, uriLocations])

  if (currency?.isNative || currency?.isWrappedToken) {
    return (
      <StyledEthereumLogo
        src={'https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png'}
        size={size}
        style={style}
        {...rest}
      />
    )
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} {...rest} />
}
