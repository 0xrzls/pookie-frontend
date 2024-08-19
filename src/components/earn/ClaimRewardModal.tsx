import { TransactionResponse } from '@ethersproject/providers'
import { t } from '@lingui/macro'
import { useState } from 'react'
import styled from 'styled-components/macro'
import { useAccount } from 'wagmi'
import { useStakingContract } from '../../hooks/useContract'
import { StakingInfo } from '../../state/stake/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { CloseIcon, TYPE } from '../../theme'
import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import { LoadingView, SubmittedView } from '../ModalViews'
import { RowBetween } from '../Row'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  stakingInfo: StakingInfo
}

export default function ClaimRewardModal({ isOpen, onDismiss, stakingInfo }: StakingModalProps) {
  const { address: account } = useAccount()

  // monitor call to help UI loading state
  const addTransaction = useTransactionAdder()
  const [hash, setHash] = useState<string | undefined>()
  const [attempting, setAttempting] = useState(false)

  function wrappedOnDismiss() {
    setHash(undefined)
    setAttempting(false)
    onDismiss()
  }

  const stakingContract = useStakingContract(stakingInfo.stakingRewardAddress)

  async function onClaimReward() {
    if (stakingContract && stakingInfo?.stakedAmount) {
      setAttempting(true)
      await stakingContract
        .getReward({ gasLimit: 350000 })
        .then((response: TransactionResponse) => {
          addTransaction(response, { summary: t`Claim accumulated UNI rewards` })
          setHash(response.hash)
        })
        .catch((error: any) => {
          setAttempting(false)
          console.log(error)
        })
    }
  }

  let error: string | undefined
  if (!account) {
    error = t`Connect wallet`
  }
  if (!stakingInfo?.stakedAmount) {
    error = error ?? t`Enter an amount`
  }

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOnDismiss} maxHeight={90}>
      {!attempting && !hash && (
        <ContentWrapper gap="lg">
          <RowBetween>
            <TYPE.mediumHeader>
              <span>Claim</span>
            </TYPE.mediumHeader>
            <CloseIcon onClick={wrappedOnDismiss} />
          </RowBetween>
          {stakingInfo?.earnedAmount && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={36}>
                {stakingInfo?.earnedAmount?.toSignificant(6)}
              </TYPE.body>
              <TYPE.body>
                <span>Unclaimed UNI</span>
              </TYPE.body>
            </AutoColumn>
          )}
          <TYPE.subHeader style={{ textAlign: 'center' }}>
            <span>When you claim without withdrawing your liquidity remains in the mining pool.</span>
          </TYPE.subHeader>
          <ButtonError disabled={!!error} error={!!error && !!stakingInfo?.stakedAmount} onClick={onClaimReward}>
            {error ?? <span>Claim</span>}
          </ButtonError>
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOnDismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.body fontSize={20}>
              <span>Claiming {stakingInfo?.earnedAmount?.toSignificant(6)} UNI</span>
            </TYPE.body>
          </AutoColumn>
        </LoadingView>
      )}
      {hash && (
        <SubmittedView onDismiss={wrappedOnDismiss} hash={hash}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>
              <span>Transaction Submitted</span>
            </TYPE.largeHeader>
            <TYPE.body fontSize={20}>
              <span>Claimed UNI!</span>
            </TYPE.body>
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  )
}
