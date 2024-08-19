import JSBI from 'jsbi'
import { Percent, CurrencyAmount, Token } from 'dependencies/sdk-core'
import { Pair } from 'dependencies/v2-sdk'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components/macro'
import { useTotalSupply } from '../../hooks/useTotalSupply'

import { useTokenBalance } from '../../state/wallet/hooks'
import { ExternalLink, TYPE } from '../../theme'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/unwrappedToken'
import { ButtonPrimary, ButtonSecondary, ButtonEmpty } from '../Button'
import { transparentize } from 'polished'
import { CardNoise } from '../earn/styled'

import { useColor } from '../../hooks/useColor'

import { GreyCard, LightCard } from '../Card'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween, RowFixed, AutoRow } from '../Row'
import { Dots } from '../swap/styleds'
import { BIG_INT_ZERO } from '../../constants/misc'
import { useAccount } from 'wagmi'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

const StyledPositionCard = styled(LightCard)<{ bgColor: any }>`
  border: none;
  background: ${({ theme, bgColor }) =>
    `radial-gradient(91.85% 100% at 1.84% 0%, ${transparentize(0.8, bgColor)} 0%, ${theme.bg3} 100%) `};
  position: relative;
  overflow: hidden;
`

interface PositionCardProps {
  pair: Pair
  showUnwrapped?: boolean
  border?: string
  stakedBalance?: CurrencyAmount<Token> // optional balance to indicate that liquidity is deposited in mining pool
}

export function MinimalPositionCard({ pair, showUnwrapped = false, border }: PositionCardProps) {
  const { address: account } = useAccount()

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance &&
    !!totalPoolTokens &&
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  return (
    <>
      {userPoolBalance && JSBI.greaterThan(userPoolBalance.quotient, JSBI.BigInt(0)) ? (
        <GreyCard border={border}>
          <AutoColumn gap="12px">
            <FixedHeightRow>
              <RowFixed>
                <Text fontWeight={500} fontSize={16}>
                  <span>Your position</span>
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <FixedHeightRow onClick={() => setShowMore(!showMore)}>
              <RowFixed>
                <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} />
                <Text fontWeight={500} fontSize={20}>
                  {currency0.symbol}/{currency1.symbol}
                </Text>
              </RowFixed>
              <RowFixed>
                <Text fontWeight={500} fontSize={20}>
                  {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <AutoColumn gap="4px">
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  <span>Your pool share:</span>
                </Text>
                <Text fontSize={16} fontWeight={500}>
                  {poolTokenPercentage ? poolTokenPercentage.toFixed(6) + '%' : '-'}
                </Text>
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  {currency0.symbol}:
                </Text>
                {token0Deposited ? (
                  <RowFixed>
                    <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                      {token0Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  {currency1.symbol}:
                </Text>
                {token1Deposited ? (
                  <RowFixed>
                    <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                      {token1Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
            </AutoColumn>
          </AutoColumn>
        </GreyCard>
      ) : (
        <LightCard>
          <TYPE.subHeader style={{ textAlign: 'center' }}>
            <span role="img" aria-label="wizard-icon">
              ⭐️
            </span>{' '}
            <span>
              By adding liquidity you&apos;ll earn 0.3% of all trades on this pair proportional to your share of the
              pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
            </span>{' '}
          </TYPE.subHeader>
        </LightCard>
      )}
    </>
  )
}

export default function FullPositionCard({ pair, border, stakedBalance }: PositionCardProps) {
  const { address: account } = useAccount()

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userDefaultPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  // if staked balance balance provided, add to standard liquidity amount
  const userPoolBalance = stakedBalance ? userDefaultPoolBalance?.add(stakedBalance) : userDefaultPoolBalance

  const poolTokenPercentage =
    !!userPoolBalance &&
    !!totalPoolTokens &&
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  const backgroundColor = useColor(pair?.token0)

  return (
    <StyledPositionCard border={border} bgColor={backgroundColor}>
      <CardNoise />
      <AutoColumn gap="12px">
        <FixedHeightRow>
          <AutoRow gap="8px" style={{ marginLeft: '8px' }}>
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
            <Text fontWeight={500} fontSize={20}>
              {!currency0 || !currency1 ? (
                <Dots>
                  <span>Loading</span>
                </Dots>
              ) : (
                `${currency0.symbol}/${currency1.symbol}`
              )}
            </Text>
          </AutoRow>
          <RowFixed gap="8px" style={{ marginRight: '4px' }}>
            <ButtonEmpty padding="6px 8px" $borderRadius="12px" width="100%" onClick={() => setShowMore(!showMore)}>
              {showMore ? (
                <>
                  <span>Manage</span>
                  <ChevronUp size="20" style={{ marginLeft: '8px', height: '20px', minWidth: '20px' }} />
                </>
              ) : (
                <>
                  <span>Manage</span>
                  <ChevronDown size="20" style={{ marginLeft: '8px', height: '20px', minWidth: '20px' }} />
                </>
              )}
            </ButtonEmpty>
          </RowFixed>
        </FixedHeightRow>

        {showMore && (
          <AutoColumn gap="8px">
            <FixedHeightRow>
              <Text fontSize={16} fontWeight={500}>
                <span>Your total pool tokens:</span>
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
              </Text>
            </FixedHeightRow>
            {stakedBalance && (
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  <span>Pool tokens in rewards pool:</span>
                </Text>
                <Text fontSize={16} fontWeight={500}>
                  {stakedBalance.toSignificant(4)}
                </Text>
              </FixedHeightRow>
            )}
            <FixedHeightRow>
              <RowFixed>
                <Text fontSize={16} fontWeight={500}>
                  <span>Pooled {currency0.symbol}:</span>
                </Text>
              </RowFixed>
              {token0Deposited ? (
                <RowFixed>
                  <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                    {token0Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency0} />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>

            <FixedHeightRow>
              <RowFixed>
                <Text fontSize={16} fontWeight={500}>
                  <span>Pooled {currency1.symbol}:</span>
                </Text>
              </RowFixed>
              {token1Deposited ? (
                <RowFixed>
                  <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                    {token1Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency1} />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>

            <FixedHeightRow>
              <Text fontSize={16} fontWeight={500}>
                <span>Your pool share:</span>
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {poolTokenPercentage ? (
                  <span>{poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)} %</span>
                ) : (
                  '-'
                )}
              </Text>
            </FixedHeightRow>

            <ButtonSecondary padding="8px" $borderRadius="8px">
              <ExternalLink
                style={{ width: '100%', textAlign: 'center' }}
                href={`https://v2.info.uniswap.org/account/${account}`}
              >
                <span>
                  View accrued fees and analytics<span style={{ fontSize: '11px' }}>↗</span>
                </span>
              </ExternalLink>
            </ButtonSecondary>
            {userDefaultPoolBalance && JSBI.greaterThan(userDefaultPoolBalance.quotient, BIG_INT_ZERO) && (
              <RowBetween marginTop="10px">
                <ButtonPrimary
                  padding="8px"
                  $borderRadius="8px"
                  as={Link}
                  to={`/migrate/v2/${pair.liquidityToken.address}`}
                  width="32%"
                >
                  <span>Migrate</span>
                </ButtonPrimary>
                <ButtonPrimary
                  padding="8px"
                  $borderRadius="8px"
                  as={Link}
                  to={`/add/v2/${currencyId(currency0)}/${currencyId(currency1)}`}
                  width="32%"
                >
                  <span>Add</span>
                </ButtonPrimary>
                <ButtonPrimary
                  padding="8px"
                  $borderRadius="8px"
                  as={Link}
                  width="32%"
                  to={`/remove/v2/${currencyId(currency0)}/${currencyId(currency1)}`}
                >
                  <span>Remove</span>
                </ButtonPrimary>
              </RowBetween>
            )}
            {stakedBalance && JSBI.greaterThan(stakedBalance.quotient, BIG_INT_ZERO) && (
              <ButtonPrimary
                padding="8px"
                $borderRadius="8px"
                as={Link}
                to={`/uni/${currencyId(currency0)}/${currencyId(currency1)}`}
                width="100%"
              >
                <span>Manage Liquidity in Rewards Pool</span>
              </ButtonPrimary>
            )}
          </AutoColumn>
        )}
      </AutoColumn>
    </StyledPositionCard>
  )
}
