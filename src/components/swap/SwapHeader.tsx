import styled from 'styled-components/macro'
import SettingsTab from '../Settings'
import { Percent } from 'dependencies/sdk-core'

import { RowBetween, RowFixed } from '../Row'
import { TYPE } from '../../theme'

const StyledSwapHeader = styled.div`
  padding: 32px;
  width: 100%;
  color: ${({ theme }) => theme.text2};

  @media only screen and (max-width: 480px) {
    padding: 16px;
  }
`

export default function SwapHeader({ allowedSlippage }: { allowedSlippage: Percent }) {
  return (
    <StyledSwapHeader>
      <RowBetween>
        <RowFixed>
          <TYPE.black fontWeight={600} fontSize={18} style={{ marginRight: '8px' }}>
            <span>Swap</span>
          </TYPE.black>
        </RowFixed>
        <RowFixed>
          <SettingsTab placeholderSlippage={allowedSlippage} />
        </RowFixed>
      </RowBetween>
    </StyledSwapHeader>
  )
}
