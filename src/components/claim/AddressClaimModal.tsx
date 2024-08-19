import { useState } from 'react'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import Modal from '../Modal'
import { AutoColumn, ColumnCenter } from '../Column'
import styled from 'styled-components/macro'
import { DataCard, CardSection, Break } from '../earn/styled'
import { RowBetween } from '../Row'
import { TYPE, ExternalLink, CloseIcon, CustomLightSpinner, UniTokenAnimated } from '../../theme'
import { ButtonPrimary } from '../Button'
import { useClaimCallback, useUserUnclaimedAmount, useUserHasAvailableClaim } from '../../state/claim/hooks'
import tokenLogo from '../../assets/images/token-logo.png'
import circle from '../../assets/images/blue-loader.png'
import { Text } from 'rebass'
import AddressInputPanel from '../AddressInputPanel'
import useENS from '../../hooks/useENS'
import { isAddress } from 'ethers/lib/utils'
import Confetti from '../Confetti'
import { CardNoise, CardBGImage, CardBGImageSmaller } from '../earn/styled'
import { useIsTransactionPending } from '../../state/transactions/hooks'
import { CurrencyAmount, Token } from 'dependencies/sdk-core'
import { shortenAddress } from '../../utils'

import { useChainId } from 'wagmi'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
`

const ModalUpper = styled(DataCard)`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #ff007a 0%, #021d43 100%);
`

const ConfirmOrLoadingWrapper = styled.div<{ activeBG: boolean }>`
  width: 100%;
  padding: 24px;
  position: relative;
  background: ${({ activeBG }) =>
    activeBG &&
    'radial-gradient(76.02% 75.41% at 1.84% 0%, rgba(255, 0, 122, 0.2) 0%, rgba(33, 114, 229, 0.2) 100%), #FFFFFF;'};
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`

export default function AddressClaimModal({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) {
  const chainId = useChainId()

  // state for smart contract input
  const [typed, setTyped] = useState('')
  function handleRecipientType(val: string) {
    setTyped(val)
  }

  // monitor for third party recipient of claim
  const { address: parsedAddress } = useENS(typed)

  // used for UI loading states
  const [attempting, setAttempting] = useState<boolean>(false)

  // monitor the status of the claim from contracts and txns
  const { claimCallback } = useClaimCallback(parsedAddress)
  const unclaimedAmount: CurrencyAmount<Token> | undefined = useUserUnclaimedAmount(parsedAddress)

  // check if the user has something available
  const hasAvailableClaim = useUserHasAvailableClaim(parsedAddress)

  const [hash, setHash] = useState<string | undefined>()

  // monitor the status of the claim from contracts and txns
  const claimPending = useIsTransactionPending(hash ?? '')
  const claimConfirmed = hash && !claimPending

  // use the hash to monitor this txn

  function onClaim() {
    setAttempting(true)
    claimCallback()
      .then((hash) => {
        setHash(hash)
      })
      // reset modal and log error
      .catch((error) => {
        setAttempting(false)
        console.log(error)
      })
  }

  function wrappedOnDismiss() {
    setAttempting(false)
    setHash(undefined)
    setTyped('')
    onDismiss()
  }

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOnDismiss} maxHeight={90}>
      <Confetti start={Boolean(isOpen && claimConfirmed && attempting)} />
      {!attempting && (
        <ContentWrapper gap="lg">
          <ModalUpper>
            <CardBGImage />
            <CardNoise />
            <CardSection gap="md">
              <RowBetween>
                <TYPE.white fontWeight={500}>
                  <span>Claim UNI Token</span>
                </TYPE.white>
                <CloseIcon onClick={wrappedOnDismiss} style={{ zIndex: 99 }} stroke="white" />
              </RowBetween>
              <TYPE.white fontWeight={700} fontSize={36}>
                <span>{unclaimedAmount?.toFixed(0, { groupSeparator: ',' } ?? '-')} UNI</span>
              </TYPE.white>
            </CardSection>
            <Break />
          </ModalUpper>
          <AutoColumn gap="md" style={{ padding: '1rem', paddingTop: '0' }} justify="center">
            <TYPE.subHeader fontWeight={500}>
              <span>
                Enter an address to trigger a UNI claim. If the address has any claimable UNI it will be sent to them on
                submission.
              </span>
            </TYPE.subHeader>
            <AddressInputPanel value={typed} onChange={handleRecipientType} />
            {parsedAddress && !hasAvailableClaim && (
              <TYPE.error error={true}>
                <span>Address has no available claim</span>
              </TYPE.error>
            )}
            <ButtonPrimary
              disabled={!isAddress(parsedAddress ?? '') || !hasAvailableClaim}
              padding="16px 16px"
              width="100%"
              $borderRadius="12px"
              mt="1rem"
              onClick={onClaim}
            >
              <span>Claim UNI</span>
            </ButtonPrimary>
          </AutoColumn>
        </ContentWrapper>
      )}
      {(attempting || claimConfirmed) && (
        <ConfirmOrLoadingWrapper activeBG={true}>
          <CardNoise />
          <CardBGImageSmaller desaturate />
          <RowBetween>
            <div />
            <CloseIcon onClick={wrappedOnDismiss} style={{ zIndex: 99 }} stroke="black" />
          </RowBetween>
          <ConfirmedIcon>
            {!claimConfirmed ? (
              <CustomLightSpinner src={circle} alt="loader" size={'90px'} />
            ) : (
              <UniTokenAnimated width="72px" src={tokenLogo} alt="UNI logo" />
            )}
          </ConfirmedIcon>
          <AutoColumn gap="100px" justify={'center'}>
            <AutoColumn gap="12px" justify={'center'}>
              <TYPE.largeHeader fontWeight={600} color="black">
                {claimConfirmed ? <span>Claimed</span> : <span>Claiming</span>}
              </TYPE.largeHeader>
              {!claimConfirmed && (
                <Text fontSize={36} color={'#ff007a'} fontWeight={800}>
                  <span>{unclaimedAmount?.toFixed(0, { groupSeparator: ',' } ?? '-')} UNI</span>
                </Text>
              )}
              {parsedAddress && (
                <TYPE.largeHeader fontWeight={600} color="black">
                  <span>for {shortenAddress(parsedAddress)}</span>
                </TYPE.largeHeader>
              )}
            </AutoColumn>
            {claimConfirmed && (
              <>
                <TYPE.subHeader fontWeight={500} color="black">
                  <span role="img" aria-label="party-hat">
                    🎉{' '}
                  </span>
                  <span>Welcome to team Unicorn :) </span>
                  <span role="img" aria-label="party-hat">
                    🎉
                  </span>
                </TYPE.subHeader>
              </>
            )}
            {attempting && !hash && (
              <TYPE.subHeader color="black">
                <span>Confirm this transaction in your wallet</span>
              </TYPE.subHeader>
            )}
            {attempting && hash && !claimConfirmed && chainId && hash && (
              <ExternalLink href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)} style={{ zIndex: 99 }}>
                <span>View transaction on Explorer</span>
              </ExternalLink>
            )}
          </AutoColumn>
        </ConfirmOrLoadingWrapper>
      )}
    </Modal>
  )
}
