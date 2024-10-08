import { ButtonPrimary } from 'components/Button'
import { AutoColumn } from 'components/Column'
import { SwapPoolTabs } from 'components/NavigationTabs'
import PositionList from 'components/PositionList'
import { RowBetween, RowFixed } from 'components/Row'
import { SwitchLocaleLink } from 'components/SwitchLocaleLink'
import Toggle from 'components/Toggle'
import { useV3Positions } from 'hooks/useV3Positions'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useWalletModalToggle } from 'state/application/hooks'
import { useUserHideClosedPositions } from 'state/user/hooks'
import styled, { ThemeContext } from 'styled-components/macro'
import { HideSmall, TYPE } from 'theme'
import { PositionDetails } from 'types/position'
import { LoadingRows } from './styleds'
import { Text } from 'rebass'
import { IconWallet } from 'assets'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const PageWrapper = styled(AutoColumn)`
  max-width: 870px;
  width: 100%;
  margin-top: 42px;

  @media only screen and (max-width: 480px) {
    margin-top: 0px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 800px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 500px;
  `};
`
const TitleRow = styled(RowBetween)`
  color: ${({ theme }) => theme.text2};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`
const ButtonRow = styled(RowFixed)`
  & > *:not(:last-child) {
    margin-right: 8px;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  `};
`

const WrapperPool = styled.div`
  background-color: white;

  padding: 16px;
  @media only screen and (min-width: 1024px) {
    padding: 32px;
  }

  border-radius: 24px;
`

const NoLiquidity = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  /* max-width: 300px;
  min-height: 25vh; */
`
const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  border-radius: 61px;
  padding: 8px 12px;
  font-size: 16px;
  font-weight: 600;
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex: 1 1 auto;
    width: 49%;
  `};
`

const MainContentWrapper = styled.main`
  /* background-color: ${({ theme }) => theme.bg0}; */
  /* background-color: #f1f1f1;
  height: 160px;
  padding: 24px 50px; */
  padding: 16px;
  @media only screen and (min-width: 1024px) {
    padding: 24px 32px;
  }

  border: 1px solid #f1f1f1;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
`

const ShowInactiveToggle = styled.div`
  display: grid;
  align-items: center;
  justify-items: end;

  grid-template-columns: 1fr auto;
  grid-column-gap: 8px;
  padding: 0 8px;
`

export default function Pool() {
  const { address: account } = useAccount()
  const toggleWalletModal = useWalletModalToggle()

  const theme = useContext(ThemeContext)
  const [userHideClosedPositions, setUserHideClosedPositions] = useUserHideClosedPositions()

  const { positions, loading: positionsLoading } = useV3Positions(account)

  const [openPositions, closedPositions] = positions?.reduce<[PositionDetails[], PositionDetails[]]>(
    (acc, p) => {
      acc[p.liquidity?.isZero() ? 1 : 0].push(p)
      return acc
    },
    [[], []]
  ) ?? [[], []]

  const filteredPositions = [...openPositions, ...(userHideClosedPositions ? [] : closedPositions)]
  const showConnectAWallet = Boolean(!account)

  return (
    <>
      <PageWrapper>
        <WrapperPool>
          <SwapPoolTabs active={'pool'} />
          <AutoColumn gap="32px" justify="center">
            <AutoColumn gap="32px" style={{ width: '100%' }}>
              <TitleRow padding={'0'}>
                <HideSmall>
                  <TYPE.mediumHeader>
                    <Text color={'#1E1E1E'} fontSize={24} fontWeight={600}>
                      Pools
                    </Text>
                  </TYPE.mediumHeader>
                </HideSmall>
                <ButtonRow>
                  <ResponsiveButtonPrimary id="join-pool-button" as={Link} to="/add/ETH">
                    + <span>New Position</span>
                  </ResponsiveButtonPrimary>
                </ButtonRow>
              </TitleRow>

              {closedPositions.length > 0 ? (
                <ShowInactiveToggle>
                  <TYPE.darkGray>
                    <span>Closed positions</span>
                  </TYPE.darkGray>
                  <Toggle
                    isActive={!userHideClosedPositions}
                    toggle={() => setUserHideClosedPositions(!userHideClosedPositions)}
                    checked={<span>Show</span>}
                    unchecked={<span>Hide</span>}
                  />
                </ShowInactiveToggle>
              ) : null}

              <>
                <MainContentWrapper>
                  {positionsLoading ? (
                    <LoadingRows>
                      <div />
                      <div />
                      <div />
                      <div />
                      <div />
                      <div />
                      <div />
                      <div />
                      <div />
                      <div />
                      <div />
                      <div />
                    </LoadingRows>
                  ) : filteredPositions && filteredPositions.length > 0 ? (
                    <PositionList positions={filteredPositions} />
                  ) : (
                    <NoLiquidity>
                      {/* <TYPE.mediumHeader color={theme.text3} textAlign="center"> */}
                      {/* <Inbox size={48} strokeWidth={1} style={{ marginBottom: '.5rem' }} /> */}
                      <div>
                        <Text color="#787878" textAlign="center">
                          Your active V3 liquidity positions will appear here.
                        </Text>
                      </div>
                      {/* </TYPE.mediumHeader> */}
                    </NoLiquidity>
                  )}
                </MainContentWrapper>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {showConnectAWallet && <ConnectButton />}
                </div>
              </>
            </AutoColumn>
          </AutoColumn>
        </WrapperPool>
        {/* <Box marginTop={24}>
          <CTACards />
        </Box> */}
      </PageWrapper>
      <SwitchLocaleLink />
    </>
  )
}
