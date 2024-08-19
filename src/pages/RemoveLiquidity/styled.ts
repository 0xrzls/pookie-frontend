import { MaxButton } from 'pages/Pool/styleds'
import { Text } from 'rebass'
import styled from 'styled-components/macro'

export const Wrapper = styled.div`
  position: relative;
  padding: 24px 20px 20px 20px;
  min-width: 460px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    min-width: 360px;
  `};
`

export const SmallMaxButton = styled(MaxButton)`
  font-size: 12px;
`

export const ResponsiveHeaderText = styled(Text)`
  font-size: 40px;
  font-weight: 500;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
     font-size: 24px
  `};
`
