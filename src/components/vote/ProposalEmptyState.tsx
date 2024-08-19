import { L2_CHAIN_IDS } from 'constants/chains'
import styled from 'styled-components/macro'
import { TYPE } from 'theme'
import { useChainId } from 'wagmi'

const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const Sub = styled.i`
  align-items: center;
  display: flex;
  justify-content: center;
  text-align: center;
`
interface EmptyStateProps {
  HeaderContent: () => JSX.Element
  SubHeaderContent: () => JSX.Element
}
const EmptyState = ({ HeaderContent, SubHeaderContent }: EmptyStateProps) => (
  <EmptyProposals>
    <TYPE.body style={{ marginBottom: '8px' }}>
      <HeaderContent />
    </TYPE.body>
    <TYPE.subHeader>
      <Sub>
        <SubHeaderContent />
      </Sub>
    </TYPE.subHeader>
  </EmptyProposals>
)

export default function ProposalEmptyState() {
  const chainId = useChainId()
  if (chainId && L2_CHAIN_IDS.includes(chainId)) {
    return (
      <EmptyState
        HeaderContent={() => <span>Please connect to Layer 1 Ethereum</span>}
        SubHeaderContent={() => (
          <span>
            PookieSwap governance is only available on Layer 1. Switch your network to Ethereum Mainnet to view
            Proposals and Vote.
          </span>
        )}
      />
    )
  }
  return (
    <EmptyState
      HeaderContent={() => <span>No proposals found.</span>}
      SubHeaderContent={() => <span>Proposals submitted by community members will appear here.</span>}
    />
  )
}
