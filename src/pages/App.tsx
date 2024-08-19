import ApeModeQueryParamReader from 'hooks/useApeModeQueryParamReader'
import { Link, NavLink, Route, Switch } from 'react-router-dom'
import styled from 'styled-components/macro'
// import AddressClaimModal from '../components/claim/AddressClaimModal'
import ErrorBoundary from '../components/ErrorBoundary'
import Header from '../components/Header'
import Polling from '../components/Header/Polling'
import Popups from '../components/Popups'
// import { ApplicationModal } from '../state/application/actions'
// import { useModalOpen, useToggleModal } from '../state/application/hooks'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import AddLiquidity from './AddLiquidity'
import { RedirectDuplicateTokenIds } from './AddLiquidity/redirects'
// import { RedirectDuplicateTokenIdsV2 } from './AddLiquidityV2/redirects'
// import CreateProposal from './CreateProposal'
// import Earn from './Earn'
// import Manage from './Earn/Manage'
// import MigrateV2 from './MigrateV2'
// import MigrateV2Pair from './MigrateV2/MigrateV2Pair'
import Pool from './Pool'
import { PositionPage } from './Pool/PositionPage'
// import PoolV2 from './Pool/v2'
// import PoolFinder from './PoolFinder'
// import RemoveLiquidity from './RemoveLiquidity'
import RemoveLiquidityV3 from './RemoveLiquidity/V3'
import Swap from './Swap'
import { OpenClaimAddressModalAndRedirectToSwap, RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'
// import Vote from './Vote'
// import VotePage from './Vote/VotePage'
import backgroundPrimary from '../assets/images/background.png'
import LandingPage from './Landing'
import { cuteRabbitImg, discordIcon, mediumIcon, telegramIcon, twitterIcon } from 'assets'

const AppWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  background-image: url(''), linear-gradient(117deg, #cde6fd 0%, #fafcff 99.77%);
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  flex: 1;
  z-index: 1;
  padding: 150px 16px 0px 16px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 6rem 16px 16px 16px;
  `};
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: center;
  position: fixed;
  top: 0;
  z-index: 2;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

// function TopLevelModals() {
//   const open = useModalOpen(ApplicationModal.ADDRESS_CLAIM)
//   const toggle = useToggleModal(ApplicationModal.ADDRESS_CLAIM)
//   return <AddressClaimModal isOpen={open} onDismiss={toggle} />
// }

const FooterWrapper = styled.div`
  margin-top: 200px;
  background-image: url(''),
    linear-gradient(
      90deg,
      #b1d287 0%,
      rgba(177, 210, 135, 0.3) 25%,
      rgba(177, 210, 135, 0) 50%,
      rgba(177, 210, 135, 0.3) 75%,
      #b1d287 100%
    );
  padding: 16px 72px;
  width: 100%;
  position: relative;
  height: 64px;

  @media only screen and (max-width: 480px) {
    margin-top: 0px;
  }
`

const NavLinkWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media only screen and (max-width: 480px) {
    justify-content: center;
  }
`

const StyledNavLink = styled(NavLink)``

const CuteRabbitWrapper = styled.div`
  position: absolute;
  right: 72px;
  bottom: 30px;

  @media only screen and (max-width: 480px) {
    display: none;
  }
`

export default function App() {
  return (
    <>
      <Route component={DarkModeQueryParamReader} />
      <Route component={ApeModeQueryParamReader} />
      <AppWrapper>
        <HeaderWrapper>
          <Header />
          <Popups />
        </HeaderWrapper>
        <BodyWrapper>
          <Polling />
          {/* <TopLevelModals /> */}
          <Switch>
            {/* <Route exact strict path="/vote" component={Vote} />

              <Route exact strict path="/vote" component={Vote} />
              <Route exact strict path="/vote/:governorIndex/:id" component={VotePage} />
              <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />
              <Route exact strict path="/uni" component={Earn} />
              <Route exact strict path="/uni/:currencyIdA/:currencyIdB" component={Manage} />
              <Route exact strict path="/send" component={RedirectPathToSwapOnly} /> */}
            <Route exact strict path="/" component={Swap} />
            <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
            <Route exact strict path="/swap" component={Swap} />

            {/* <Route exact strict path="/pool/v2/find" component={PoolFinder} />
              <Route exact strict path="/pool/v2" component={PoolV2} /> */}
            <Route exact strict path="/pool" component={Pool} />
            <Route exact strict path="/pool/:tokenId" component={PositionPage} />

            {/* <Route exact strict path="/add/v2/:currencyIdA?/:currencyIdB?" component={RedirectDuplicateTokenIdsV2} /> */}
            <Route
              exact
              strict
              path="/add/:currencyIdA?/:currencyIdB?/:feeAmount?"
              component={RedirectDuplicateTokenIds}
            />

            <Route
              exact
              strict
              path="/increase/:currencyIdA?/:currencyIdB?/:feeAmount?/:tokenId?"
              component={AddLiquidity}
            />

            {/* <Route exact strict path="/remove/v2/:currencyIdA/:currencyIdB" component={RemoveLiquidity} /> */}
            <Route exact strict path="/remove/:tokenId" component={RemoveLiquidityV3} />

            {/* <Route exact strict path="/migrate/v2" component={MigrateV2} />
              <Route exact strict path="/migrate/v2/:address" component={MigrateV2Pair} />

              <Route exact strict path="/create-proposal" component={CreateProposal} /> */}
            <Route component={RedirectPathToSwapOnly} />
          </Switch>
          <Marginer />
        </BodyWrapper>
        <FooterWrapper>
          <NavLinkWrapper>
            <StyledNavLink to="/">
              <img src={discordIcon} />
            </StyledNavLink>
            <StyledNavLink to="/">
              <img src={mediumIcon} />
            </StyledNavLink>
            <StyledNavLink to="/">
              <img src={twitterIcon} />
            </StyledNavLink>
            <StyledNavLink to="/">
              <img src={telegramIcon} />
            </StyledNavLink>
          </NavLinkWrapper>
          <CuteRabbitWrapper>
            <img src={cuteRabbitImg} />
          </CuteRabbitWrapper>
        </FooterWrapper>
      </AppWrapper>
    </>
  )
}
