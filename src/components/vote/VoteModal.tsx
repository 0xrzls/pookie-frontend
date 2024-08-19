import { useState, useContext } from 'react'
import { getExplorerLink, ExplorerDataType } from '../../utils/getExplorerLink'

import Modal from '../Modal'
import { AutoColumn, ColumnCenter } from '../Column'
import styled, { ThemeContext } from 'styled-components/macro'
import { RowBetween } from '../Row'
import { TYPE, CustomLightSpinner } from '../../theme'
import { X, ArrowUpCircle } from 'react-feather'
import { ButtonPrimary } from '../Button'
import circle from '../../assets/images/blue-loader.png'
import { useVoteCallback, useUserVotes } from '../../state/governance/hooks'
import { ExternalLink } from '../../theme/components'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'

import { useChainId } from 'wagmi'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 24px;
`

const StyledClosed = styled(X)`
  :hover {
    cursor: pointer;
  }
`

const ConfirmOrLoadingWrapper = styled.div`
  width: 100%;
  padding: 24px;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`

interface VoteModalProps {
  isOpen: boolean
  onDismiss: () => void
  support: boolean // if user is for or against proposal
  proposalId: string | undefined // id for the proposal to vote on
}

export default function VoteModal({ isOpen, onDismiss, proposalId, support }: VoteModalProps) {
  const chainId = useChainId()
  const {
    voteCallback,
  }: {
    voteCallback: (proposalId: string | undefined, support: boolean) => Promise<string> | undefined
  } = useVoteCallback()
  const { votes: availableVotes } = useUserVotes()

  // monitor call to help UI loading state
  const [hash, setHash] = useState<string | undefined>()
  const [attempting, setAttempting] = useState<boolean>(false)

  // get theme for colors
  const theme = useContext(ThemeContext)

  // wrapper to reset state on modal close
  function wrappedOndismiss() {
    setHash(undefined)
    setAttempting(false)
    onDismiss()
  }

  async function onVote() {
    setAttempting(true)

    // if callback not returned properly ignore
    if (!voteCallback) return

    // try delegation and store hash
    const hash = await voteCallback(proposalId, support)?.catch((error) => {
      setAttempting(false)
      console.log(error)
    })

    if (hash) {
      setHash(hash)
    }
  }

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOndismiss} maxHeight={90}>
      {!attempting && !hash && (
        <ContentWrapper gap="lg">
          <AutoColumn gap="lg" justify="center">
            <RowBetween>
              <TYPE.mediumHeader fontWeight={500}>
                {support ? (
                  <span>Vote for proposal {proposalId}</span>
                ) : (
                  <span>Vote against proposal {proposalId}</span>
                )}
              </TYPE.mediumHeader>
              <StyledClosed stroke="black" onClick={wrappedOndismiss} />
            </RowBetween>
            <TYPE.largeHeader>
              <span>{formatCurrencyAmount(availableVotes, 4)} Votes</span>
            </TYPE.largeHeader>
            <ButtonPrimary onClick={onVote}>
              <TYPE.mediumHeader color="white">
                {support ? (
                  <span>Vote for proposal {proposalId}</span>
                ) : (
                  <span>Vote against proposal {proposalId}</span>
                )}
              </TYPE.mediumHeader>
            </ButtonPrimary>
          </AutoColumn>
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <ConfirmOrLoadingWrapper>
          <RowBetween>
            <div />
            <StyledClosed onClick={wrappedOndismiss} />
          </RowBetween>
          <ConfirmedIcon>
            <CustomLightSpinner src={circle} alt="loader" size={'90px'} />
          </ConfirmedIcon>
          <AutoColumn gap="100px" justify={'center'}>
            <AutoColumn gap="12px" justify={'center'}>
              <TYPE.largeHeader>
                <span>Submitting Vote</span>
              </TYPE.largeHeader>
            </AutoColumn>
            <TYPE.subHeader>
              <span>Confirm this transaction in your wallet</span>
            </TYPE.subHeader>
          </AutoColumn>
        </ConfirmOrLoadingWrapper>
      )}
      {hash && (
        <ConfirmOrLoadingWrapper>
          <RowBetween>
            <div />
            <StyledClosed onClick={wrappedOndismiss} />
          </RowBetween>
          <ConfirmedIcon>
            <ArrowUpCircle strokeWidth={0.5} size={90} color={theme.primary1} />
          </ConfirmedIcon>
          <AutoColumn gap="100px" justify={'center'}>
            <AutoColumn gap="12px" justify={'center'}>
              <TYPE.largeHeader>
                <span>Transaction Submitted</span>
              </TYPE.largeHeader>
            </AutoColumn>
            {chainId && (
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
      )}
    </Modal>
  )
}
