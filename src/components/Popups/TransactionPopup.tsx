import { useContext } from 'react'
import { AlertCircle, CheckCircle } from 'react-feather'
import styled, { ThemeContext } from 'styled-components/macro'
import { TYPE } from '../../theme'
import { ExternalLink } from '../../theme/components'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'
import { useChainId } from 'wagmi'

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
  z-index: 999 !important;
`

export default function TransactionPopup({
  hash,
  success,
  summary,
}: {
  hash: string
  success?: boolean
  summary?: string
}) {
  const chainId = useChainId()

  const theme = useContext(ThemeContext)

  return (
    <RowNoFlex>
      <div style={{ paddingRight: 16 }}>
        {success ? <CheckCircle color={theme.green1} size={24} /> : <AlertCircle color={theme.red1} size={24} />}
      </div>
      <AutoColumn gap="8px">
        <TYPE.body fontWeight={500}>{summary ?? 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)}</TYPE.body>
        {chainId && (
          <ExternalLink href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)}>
            View on Explorer
          </ExternalLink>
        )}
      </AutoColumn>
    </RowNoFlex>
  )
}
