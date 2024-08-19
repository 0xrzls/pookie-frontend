import { useContext } from 'react'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'

import { AutoColumn, ColumnCenter } from '../Column'
import styled, { ThemeContext } from 'styled-components/macro'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon, CustomLightSpinner } from '../../theme'
import { ArrowUpCircle } from 'react-feather'

import circle from '../../assets/images/blue-loader.png'
import { ExternalLink } from '../../theme/components'
import { useChainId } from 'wagmi'

const ConfirmOrLoadingWrapper = styled.div`
  width: 100%;
  padding: 24px;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`

export function LoadingView({ children, onDismiss }: { children: any; onDismiss: () => void }) {
  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <ConfirmedIcon>
        <CustomLightSpinner src={circle} alt="loader" size={'90px'} />
      </ConfirmedIcon>
      <AutoColumn gap="100px" justify={'center'}>
        {children}
        <TYPE.subHeader>
          <span>Confirm this transaction in your wallet</span>
        </TYPE.subHeader>
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  )
}

export function SubmittedView({
  children,
  onDismiss,
  hash,
}: {
  children: any
  onDismiss: () => void
  hash: string | undefined
}) {
  const theme = useContext(ThemeContext)
  const chainId = useChainId()

  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <ConfirmedIcon>
        <ArrowUpCircle strokeWidth={0.5} size={90} color={theme.primary1} />
      </ConfirmedIcon>
      <AutoColumn gap="100px" justify={'center'}>
        {children}
        {chainId && hash && (
          <ExternalLink
            href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)}
            style={{ marginLeft: '4px' }}
          >
            <TYPE.subHeader>
              <span>View transaction on Explorer</span>
            </TYPE.subHeader>
          </ExternalLink>
        )}
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  )
}
