import useScrollPosition from '@react-hook/window-scroll'
import { MenuIcon, pookieLogo } from 'assets'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Text } from 'rebass'
import { useShowClaimPopup, useToggleSelfClaimModal } from 'state/application/hooks'
import { useUserHasAvailableClaim } from 'state/claim/hooks'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import styled from 'styled-components/macro'
import { useAccount } from 'wagmi'
import { TYPE } from '../../theme'
import ClaimModal from '../claim/ClaimModal'
import { CardNoise } from '../earn/styled'
import Modal from '../Modal'
import Row, { RowFixed } from '../Row'
import { Dots } from '../swap/styleds'
import Web3Status from '../Web3Status'
import UniBalanceContent from './UniBalanceContent'

const HeaderFrame = styled.div<{ showBackground: boolean }>`
  margin: 24px 72px;
  background-color: #ffffff;
  max-width: 1288px;
  display: grid;
  grid-template-columns: 1fr 0px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  padding: 20px 32px;
  z-index: 10;
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
  border-radius: 99px;

  @media only screen and (max-width: 480px) {
    margin: 0px;
    border-radius: 0px;
  }

  /* Background slide effect on scroll. */

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
    grid-template-columns: auto 1fr;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 1rem;
  `}
`
const LeftSideContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-self: start;
  justify-items: center;
  align-items: center;
  gap: 64px;
  @media only screen and (max-width: 640px) {
    display: none;
  }
`
const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row-reverse;
    align-items: center;
  `};
`
const Menu = styled.div`
  display: block;
  @media only screen and (min-width: 640px) {
    display: none;
  }
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`

  `};
`

const HeaderLinks = styled(Row)`
  width: fit-content;
  border-radius: 16px;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 24px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    justify-self: flex-end;
  `};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;

  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;
`

const UNIAmount = styled(AccountElement)`
  color: white;
  padding: 4px 8px;
  height: 36px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.bg3};
  background: radial-gradient(174.47% 188.91% at 1.84% 0%, #ff007a 0%, #2172e5 100%), #edeef2;
`

const UNIWrapper = styled.span`
  width: fit-content;
  position: relative;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }

  :active {
    opacity: 0.9;
  }
`

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;

  `};
  border-radius: 9999px;
  background: rgba(242, 102, 25, 0.2);
  margin-right: 14px;
  @media only screen and (max-width: 1024px) {
    display: none;
  }
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;

  `};
`
const BoxBalance = styled.div`
  padding: 8px;
  border-radius: 57px;
  background: rgba(242, 102, 25, 0.2);
  margin-right: 14px;
  @media only screen and (max-width: 1024px) {
    display: none;
  }
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  gap: 6px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`

// const UniIcon = styled.div`
//   transition: transform 0.3s ease;
//   :hover {
//     transform: rotate(-5deg);
//   }
// `

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;

  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: #262626;
  font-size: 18px;
  width: fit-content;
  font-weight: 600;
  /* padding: 8px 12px; */
  border-radius: 14px;

  &.${activeClassName} {
    color: #f26619;
  }
`

// const StyledExternalLink = styled(ExternalLink).attrs({
//   activeClassName,
// })<{ isActive?: boolean }>`
//   ${({ theme }) => theme.flexRowNoWrap}
//   align-items: left;
//   border-radius: 3rem;
//   outline: none;
//   cursor: pointer;
//   text-decoration: none;
//   color: ${({ theme }) => theme.text2};
//   font-size: 1rem;
//   width: fit-content;
//   margin: 0 12px;
//   font-weight: 500;

//   &.${activeClassName} {
//     border-radius: 12px;
//     font-weight: 600;
//     color: ${({ theme }) => theme.white};
//   }

//   :hover,
//   :focus {
//     color: ${({ theme }) => darken(0.1, theme.text1)};
//     text-decoration: none;
//   }

//   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//       display: none;
// `}
// `
const SideBar = styled.div<{ isOpen: boolean }>`
  background: #ffffff;
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.05);
  border-radius: 0px 16px 16px 0px;
  border-right: 1px solid #f0f0f0;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 260px;
  z-index: 99;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0px)' : 'translateX(-260px)')};
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  padding: 20px;
`

const StyledLogo = styled.img`
  object-fit: cover;
  height: 48px;
`

export const SideBarMenuMobile = ({ isOpen, handleClose }: { isOpen: boolean; handleClose: () => void }) => {
  return (
    <SideBar isOpen={isOpen}>
      <HeaderRow onClick={handleClose}>
        <Title href=".">
          <StyledLogo src={pookieLogo} />
        </Title>
      </HeaderRow>
      <HeaderLinks
        style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}
        onClick={handleClose}
      >
        <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
          <span>Swap</span>
        </StyledNavLink>
        <StyledNavLink
          id={`pool-nav-link`}
          to={'/pool'}
          isActive={(match, { pathname }) =>
            Boolean(match) ||
            pathname.startsWith('/add') ||
            pathname.startsWith('/remove') ||
            pathname.startsWith('/increase') ||
            pathname.startsWith('/find')
          }
        >
          <span>Pool</span>
        </StyledNavLink>
      </HeaderLinks>
    </SideBar>
  )
}

export default function Header() {
  const { address: account } = useAccount()

  const toggleClaimModal = useToggleSelfClaimModal()

  const availableClaim: boolean = useUserHasAvailableClaim(account)

  const { claimTxn } = useUserHasSubmittedClaim(account ?? undefined)

  const [showUniBalanceModal, setShowUniBalanceModal] = useState(false)
  const showClaimPopup = useShowClaimPopup()

  const scrollY = useScrollPosition()
  const [isOpenMobile, setIsOpenMobile] = useState(false)
  const handleToggleMenu = () => {
    setIsOpenMobile((prev) => !prev)
  }

  const handleCloseMenu = () => {
    setIsOpenMobile(false)
  }

  return (
    <HeaderFrame showBackground={scrollY > 45}>
      <SideBarMenuMobile isOpen={isOpenMobile} handleClose={handleCloseMenu} />
      {isOpenMobile && (
        <div
          onClick={handleCloseMenu}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgb(0, 0, 0,0.1)',
            backdropFilter: 'blur(10px)',
            zIndex: 10,
          }}
        />
      )}
      <ClaimModal />
      <Modal isOpen={showUniBalanceModal} onDismiss={() => setShowUniBalanceModal(false)}>
        <UniBalanceContent setShowUniBalanceModal={setShowUniBalanceModal} />
      </Modal>
      <LeftSideContainer>
        <HeaderRow>
          <Title href=".">
            <StyledLogo src={pookieLogo} />
          </Title>
        </HeaderRow>
        <HeaderLinks>
          <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
            <span>Swap</span>
          </StyledNavLink>
          <StyledNavLink
            id={`pool-nav-link`}
            to={'/pool'}
            isActive={(match, { pathname }) =>
              Boolean(match) ||
              pathname.startsWith('/add') ||
              pathname.startsWith('/remove') ||
              pathname.startsWith('/increase') ||
              pathname.startsWith('/find')
            }
          >
            <span>Pool</span>
          </StyledNavLink>
        </HeaderLinks>
      </LeftSideContainer>
      <Menu onClick={() => handleToggleMenu()}>
        <MenuIcon />
      </Menu>

      <HeaderControls>
        <HeaderElement>
          {availableClaim && !showClaimPopup && (
            <UNIWrapper onClick={toggleClaimModal}>
              <UNIAmount active={!!account && !availableClaim} style={{ pointerEvents: 'auto' }}>
                <TYPE.white padding="0 2px">
                  {claimTxn && !claimTxn?.receipt ? (
                    <Dots>
                      <span>Claiming UNI</span>
                    </Dots>
                  ) : (
                    <span>Claim UNI</span>
                  )}
                </TYPE.white>
              </UNIAmount>
              <CardNoise />
            </UNIWrapper>
          )}
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            <Web3Status />
          </AccountElement>
        </HeaderElement>
      </HeaderControls>
    </HeaderFrame>
  )
}
