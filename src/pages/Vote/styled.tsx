import styled, { DefaultTheme } from 'styled-components/macro'
import { ProposalState } from '../../state/governance/hooks'

const handleColorType = (status: ProposalState, theme: DefaultTheme) => {
  switch (status) {
    case ProposalState.PENDING:
    case ProposalState.ACTIVE:
      return theme.blue1
    case ProposalState.SUCCEEDED:
    case ProposalState.EXECUTED:
      return theme.green1
    case ProposalState.DEFEATED:
      return theme.red1
    case ProposalState.QUEUED:
    case ProposalState.CANCELED:
    case ProposalState.EXPIRED:
    default:
      return theme.text3
  }
}

function StatusText({ status }: { status: ProposalState }) {
  switch (status) {
    case ProposalState.PENDING:
      return <span>Pending</span>
    case ProposalState.ACTIVE:
      return <span>Active</span>
    case ProposalState.SUCCEEDED:
      return <span>Succeeded</span>
    case ProposalState.EXECUTED:
      return <span>Executed</span>
    case ProposalState.DEFEATED:
      return <span>Defeated</span>
    case ProposalState.QUEUED:
      return <span>Queued</span>
    case ProposalState.CANCELED:
      return <span>Canceled</span>
    case ProposalState.EXPIRED:
      return <span>Expired</span>
    default:
      return <span>Undetermined</span>
  }
}

const StyledProposalContainer = styled.span<{ status: ProposalState }>`
  font-size: 0.825rem;
  font-weight: 600;
  padding: 0.5rem;
  border-radius: 8px;
  color: ${({ status, theme }) => handleColorType(status, theme)};
  border: 1px solid ${({ status, theme }) => handleColorType(status, theme)};
  width: fit-content;
  justify-self: flex-end;
  text-transform: uppercase;
`

export function ProposalStatus({ status }: { status: ProposalState }) {
  return (
    <StyledProposalContainer status={status}>
      <StatusText status={status} />
    </StyledProposalContainer>
  )
}
