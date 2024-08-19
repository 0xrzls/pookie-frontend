import { ConnectButton } from '@rainbow-me/rainbowkit'
import { swapIcon } from 'assets'
import { NetworkAlert } from 'components/NetworkAlert/NetworkAlert'
import { AdvancedSwapDetails } from 'components/swap/AdvancedSwapDetails'
import UnsupportedCurrencyFooter from 'components/swap/UnsupportedCurrencyFooter'
import { MouseoverTooltip, MouseoverTooltipContent } from 'components/Tooltip'
import { Currency, CurrencyAmount, Token, TradeType } from 'dependencies/sdk-core'
import { Trade as V2Trade } from 'dependencies/v2-sdk'
import { Trade as V3Trade } from 'dependencies/v3-sdk'
import JSBI from 'jsbi'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowLeft, CheckCircle, HelpCircle, Info } from 'react-feather'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components/macro'
import { useAccount } from 'wagmi'
import AddressInputPanel from '../../components/AddressInputPanel'
import { ButtonConfirmed, ButtonError, ButtonGray, ButtonPrimary } from '../../components/Button'
import { GreyCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import CurrencyLogo from '../../components/CurrencyLogo'
import Loader from '../../components/Loader'
import Row, { AutoRow, RowFixed } from '../../components/Row'
import BetterTradeLink from '../../components/swap/BetterTradeLink'
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal'
import { ArrowWrapper, Dots, SwapCallbackError, Wrapper } from '../../components/swap/styleds'
import SwapHeader from '../../components/swap/SwapHeader'
import TradePrice from '../../components/swap/TradePrice'
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink'
import TokenWarningModal from '../../components/TokenWarningModal'
import { useAllTokens, useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { V3TradeState } from '../../hooks/useBestV3Trade'
import useENSAddress from '../../hooks/useENSAddress'
import { useERC20PermitFromTrade, UseERC20PermitState } from '../../hooks/useERC20Permit'
import useIsArgentWallet from '../../hooks/useIsArgentWallet'
import { useIsSwapUnsupported } from '../../hooks/useIsSwapUnsupported'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import useToggledVersion, { Version } from '../../hooks/useToggledVersion'
import { useUSDCValue } from '../../hooks/useUSDCPrice'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/swap/hooks'
import { useExpertModeManager, useUserSingleHopOnly } from '../../state/user/hooks'
import { HideSmall, LinkStyledButton, TYPE } from '../../theme'
import { computeFiatValuePriceImpact } from '../../utils/computeFiatValuePriceImpact'
import { getTradeVersion } from '../../utils/getTradeVersion'
import { isTradeBetter } from '../../utils/isTradeBetter'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { warningSeverity } from '../../utils/prices'
import AppBody from '../AppBody'

const StyledInfo = styled(Info)`
  opacity: 0.4;
  color: ${({ theme }) => theme.text1};
  height: 16px;
  width: 16px;
  :hover {
    opacity: 0.8;
  }
`

export default function Swap({ history }: RouteComponentProps) {
  const { address: account } = useAccount()
  const loadedUrlParams = useDefaultsFromURLSearch()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c?.isToken ?? false) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !Boolean(token.address in defaultTokens)
    })

  const theme = useContext(ThemeContext)

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  // get version from the url
  const toggledVersion = useToggledVersion()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const {
    v2Trade,
    v3TradeState: { trade: v3Trade, state: v3TradeState },
    toggledTrade: trade,
    allowedSlippage,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo(toggledVersion)

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const { address: recipientAddress } = useENSAddress(recipient)

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
            [Field.INPUT]: parsedAmount,
            [Field.OUTPUT]: parsedAmount,
          }
        : {
            [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
            [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
          },
    [independentField, parsedAmount, showWrap, trade]
  )

  const fiatValueInput = useUSDCValue(parsedAmounts[Field.INPUT])
  const fiatValueOutput = useUSDCValue(parsedAmounts[Field.OUTPUT])
  const priceImpact = computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput)

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  // reset if they close warning without tokens in params
  const handleDismissTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
    history.push('/swap/')
  }, [history])

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: V2Trade<Currency, Currency, TradeType> | V3Trade<Currency, Currency, TradeType> | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )
  const routeNotFound = !trade?.route
  const isLoadingRoute = toggledVersion === Version.v3 && V3TradeState.LOADING === v3TradeState

  // check whether the user has approved the router on the input token
  const [approvalState, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)
  const {
    state: signatureState,
    signatureData,
    gatherPermitSignature,
  } = useERC20PermitFromTrade(trade, allowedSlippage)

  const handleApprove = useCallback(async () => {
    if (signatureState === UseERC20PermitState.NOT_SIGNED && gatherPermitSignature) {
      try {
        await gatherPermitSignature()
      } catch (error) {
        // try to approve if gatherPermitSignature failed for any reason other than the user rejecting it
        // @ts-ignore
        if (error?.code !== 4001) {
          await approveCallback()
        }
      }
    } else {
      await approveCallback()
    }
  }, [approveCallback, gatherPermitSignature, signatureState])

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approvalState, approvalSubmitted])

  const maxInputAmount: CurrencyAmount<Currency> | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const showMaxButton = Boolean(maxInputAmount?.greaterThan(0) && !parsedAmounts[Field.INPUT]?.equalTo(maxInputAmount))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    recipient,
    signatureData
  )

  const [singleHopOnly] = useUserSingleHopOnly()

  const handleSwap = useCallback(() => {
    if (!swapCallback) {
      return
    }
    if (priceImpact && !confirmPriceImpactWithoutFee(priceImpact)) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [
    priceImpact,
    swapCallback,
    tradeToConfirm,
    showConfirm,
  ])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on the greater of fiat value price impact and execution price impact
  const priceImpactSeverity = useMemo(() => {
    const executionPriceImpact = trade?.priceImpact
    return warningSeverity(
      executionPriceImpact && priceImpact
        ? executionPriceImpact.greaterThan(priceImpact)
          ? executionPriceImpact
          : priceImpact
        : executionPriceImpact ?? priceImpact
    )
  }, [priceImpact, trade])

  const isArgentWallet = useIsArgentWallet()

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !isArgentWallet &&
    !swapInputError &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.PENDING ||
      (approvalSubmitted && approvalState === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm })
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

  const handleInputSelect = useCallback(
    (inputCurrency: Currency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [onCurrencySelection]
  )

  const handleMaxInput = useCallback(() => {
    maxInputAmount && onUserInput(Field.INPUT, maxInputAmount.toExact())
  }, [maxInputAmount, onUserInput])

  const handleOutputSelect = useCallback(
    (outputCurrency: Currency) => onCurrencySelection(Field.OUTPUT, outputCurrency),
    [onCurrencySelection]
  )

  const swapIsUnsupported = useIsSwapUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  const priceImpactTooHigh = priceImpactSeverity > 3 && !isExpertMode

  return (
    <>
      <TokenWarningModal
        isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
        tokens={importTokensNotInDefault}
        onConfirm={handleConfirmTokenWarning}
        onDismiss={handleDismissTokenWarning}
      />
      <NetworkAlert />
      <AppBody>
        <SwapHeader allowedSlippage={allowedSlippage} />
        <Wrapper id="swap-page">
          <ConfirmSwapModal
            isOpen={showConfirm}
            trade={trade}
            originalTrade={tradeToConfirm}
            onAcceptChanges={handleAcceptChanges}
            attemptingTxn={attemptingTxn}
            txHash={txHash}
            recipient={recipient}
            allowedSlippage={allowedSlippage}
            onConfirm={handleSwap}
            swapErrorMessage={swapErrorMessage}
            onDismiss={handleConfirmDismiss}
          />

          <AutoColumn gap={'md'}>
            <div style={{ display: 'relative' }}>
              <CurrencyInputPanel
                label={independentField === Field.OUTPUT && !showWrap ? <span>From (at most)</span> : <span>From</span>}
                value={formattedAmounts[Field.INPUT]}
                showMaxButton={showMaxButton}
                currency={currencies[Field.INPUT]}
                onUserInput={handleTypeInput}
                onMax={handleMaxInput}
                fiatValue={fiatValueInput ?? undefined}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies[Field.OUTPUT]}
                showCommonBases={true}
                id="swap-currency-input"
              />
              <ArrowWrapper
                clickable
                style={{
                  border: 'none',
                  padding: '0px',
                  backgroundColor: 'transparent',
                }}
              >
                {/* <ArrowDown
                  size="16"
                  onClick={() => {
                    setApprovalSubmitted(false) // reset 2 step UI for approvals
                    onSwitchTokens()
                  }}
                  color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? theme.text1 : theme.text3}
                /> */}
                <img
                  src={swapIcon}
                  onClick={() => {
                    setApprovalSubmitted(false) // reset 2 step UI for approvals
                    onSwitchTokens()
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </ArrowWrapper>
              <CurrencyInputPanel
                value={formattedAmounts[Field.OUTPUT]}
                onUserInput={handleTypeOutput}
                label={independentField === Field.INPUT && !showWrap ? <span>To (at least)</span> : <span>To</span>}
                showMaxButton={false}
                hideBalance={false}
                fiatValue={fiatValueOutput ?? undefined}
                priceImpact={priceImpact}
                currency={currencies[Field.OUTPUT]}
                onCurrencySelect={handleOutputSelect}
                otherCurrency={currencies[Field.INPUT]}
                showCommonBases={true}
                id="swap-currency-output"
              />
            </div>

            {recipient !== null && !showWrap ? (
              <>
                <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                  <ArrowWrapper clickable={false}>
                    <ArrowDown size="16" color={theme.text2} />
                  </ArrowWrapper>
                  <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                    <span>- Remove send</span>
                  </LinkStyledButton>
                </AutoRow>
                <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
              </>
            ) : null}

            {showWrap ? null : (
              <Row style={{ justifyContent: !trade ? 'center' : 'space-between' }}>
                <RowFixed>
                  {[V3TradeState.VALID, V3TradeState.SYNCING, V3TradeState.NO_ROUTE_FOUND].includes(v3TradeState) &&
                    (toggledVersion === Version.v3 && isTradeBetter(v3Trade, v2Trade) ? (
                      <BetterTradeLink version={Version.v2} otherTradeNonexistent={!v3Trade} />
                    ) : toggledVersion === Version.v2 && isTradeBetter(v2Trade, v3Trade) ? (
                      <BetterTradeLink version={Version.v3} otherTradeNonexistent={!v2Trade} />
                    ) : (
                      toggledVersion === Version.v2 && (
                        <ButtonGray
                          width="fit-content"
                          padding="0.1rem 0.5rem 0.1rem 0.35rem"
                          as={Link}
                          to="/swap"
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            height: '24px',
                            lineHeight: '120%',
                            marginLeft: '0.75rem',
                          }}
                        >
                          <ArrowLeft color={theme.text3} size={12} /> &nbsp;
                          <TYPE.main style={{ lineHeight: '120%' }} fontSize={12}>
                            <span>
                              <HideSmall>Back to </HideSmall>
                              V3
                            </span>
                          </TYPE.main>
                        </ButtonGray>
                      )
                    ))}

                  {toggledVersion === Version.v3 && trade && isTradeBetter(v2Trade, v3Trade) && (
                    <ButtonGray
                      width="fit-content"
                      padding="0.1rem 0.5rem"
                      disabled
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        height: '24px',
                        opacity: 0.8,
                        marginLeft: '0.25rem',
                      }}
                    >
                      <TYPE.black fontSize={12}>
                        <span>V3</span>
                      </TYPE.black>
                    </ButtonGray>
                  )}
                </RowFixed>
                {trade ? (
                  <RowFixed>
                    <TradePrice
                      price={trade.executionPrice}
                      showInverted={showInverted}
                      setShowInverted={setShowInverted}
                    />
                    <MouseoverTooltipContent
                      content={<AdvancedSwapDetails trade={trade} allowedSlippage={allowedSlippage} />}
                    >
                      <StyledInfo />
                    </MouseoverTooltipContent>
                  </RowFixed>
                ) : null}
              </Row>
            )}

            <div>
              {swapIsUnsupported ? (
                <ButtonPrimary disabled={true}>
                  <TYPE.main mb="4px">
                    <span>Unsupported Asset</span>
                  </TYPE.main>
                </ButtonPrimary>
              ) : !account ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <ConnectButton />
                </div>
              ) : showWrap ? (
                <ButtonPrimary disabled={Boolean(wrapInputError)} onClick={onWrap}>
                  {wrapInputError ??
                    (wrapType === WrapType.WRAP ? (
                      <span>Wrap</span>
                    ) : wrapType === WrapType.UNWRAP ? (
                      <span>Unwrap</span>
                    ) : null)}
                </ButtonPrimary>
              ) : routeNotFound && userHasSpecifiedInputOutput ? (
                <GreyCard style={{ textAlign: 'center', borderRadius: 99 }}>
                  <TYPE.main mb="4px">
                    {isLoadingRoute ? (
                      <Dots>
                        <span>Loading</span>
                      </Dots>
                    ) : singleHopOnly ? (
                      <span>Insufficient liquidity for this trade. Try enabling multi-hop trades.</span>
                    ) : (
                      <span>Insufficient liquidity for this trade.</span>
                    )}
                  </TYPE.main>
                </GreyCard>
              ) : showApproveFlow ? (
                <AutoRow style={{ flexWrap: 'nowrap', width: '100%' }}>
                  <AutoColumn style={{ width: '100%' }} gap="12px">
                    <ButtonConfirmed
                      onClick={handleApprove}
                      disabled={
                        approvalState !== ApprovalState.NOT_APPROVED ||
                        approvalSubmitted ||
                        signatureState === UseERC20PermitState.SIGNED
                      }
                      width="100%"
                      altDisabledStyle={approvalState === ApprovalState.PENDING} // show solid button while waiting
                      confirmed={
                        approvalState === ApprovalState.APPROVED || signatureState === UseERC20PermitState.SIGNED
                      }
                    >
                      <AutoRow justify="space-between" style={{ flexWrap: 'nowrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          <CurrencyLogo
                            currency={currencies[Field.INPUT]}
                            size={'20px'}
                            style={{ marginRight: '8px', flexShrink: 0 }}
                          />
                          {/* we need to shorten this string on mobile */}
                          {approvalState === ApprovalState.APPROVED || signatureState === UseERC20PermitState.SIGNED ? (
                            <span>You can now trade {currencies[Field.INPUT]?.symbol}</span>
                          ) : (
                            <span>Allow PookieSwap to use your {currencies[Field.INPUT]?.symbol}</span>
                          )}
                        </span>
                        {approvalState === ApprovalState.PENDING ? (
                          <Loader stroke="white" />
                        ) : (approvalSubmitted && approvalState === ApprovalState.APPROVED) ||
                          signatureState === UseERC20PermitState.SIGNED ? (
                          <CheckCircle size="20" color={theme.green1} />
                        ) : (
                          <MouseoverTooltip
                            text={
                              <span>
                                You must give the PookieSwap smart contracts permission to use your{' '}
                                {currencies[Field.INPUT]?.symbol}. You only have to do this once per token.
                              </span>
                            }
                          >
                            <HelpCircle size="20" color={'white'} style={{ marginLeft: '8px' }} />
                          </MouseoverTooltip>
                        )}
                      </AutoRow>
                    </ButtonConfirmed>
                    <ButtonError
                      onClick={() => {
                        if (isExpertMode) {
                          handleSwap()
                        } else {
                          setSwapState({
                            tradeToConfirm: trade,
                            attemptingTxn: false,
                            swapErrorMessage: undefined,
                            showConfirm: true,
                            txHash: undefined,
                          })
                        }
                      }}
                      width="100%"
                      id="swap-button"
                      disabled={
                        !isValid ||
                        (approvalState !== ApprovalState.APPROVED && signatureState !== UseERC20PermitState.SIGNED) ||
                        priceImpactTooHigh
                      }
                      error={isValid && priceImpactSeverity > 2}
                    >
                      <Text fontSize={16} fontWeight={500}>
                        {priceImpactTooHigh ? (
                          <span>High Price Impact</span>
                        ) : priceImpactSeverity > 2 ? (
                          <span>Swap Anyway</span>
                        ) : (
                          <span>Swap</span>
                        )}
                      </Text>
                    </ButtonError>
                  </AutoColumn>
                </AutoRow>
              ) : (
                <ButtonError
                  onClick={() => {
                    if (isExpertMode) {
                      handleSwap()
                    } else {
                      setSwapState({
                        tradeToConfirm: trade,
                        attemptingTxn: false,
                        swapErrorMessage: undefined,
                        showConfirm: true,
                        txHash: undefined,
                      })
                    }
                  }}
                  id="swap-button"
                  disabled={!isValid || priceImpactTooHigh || !!swapCallbackError}
                  error={isValid && priceImpactSeverity > 2 && !swapCallbackError}
                >
                  <Text fontSize={20} fontWeight={500}>
                    {swapInputError ? (
                      swapInputError
                    ) : priceImpactTooHigh ? (
                      <span>Price Impact Too High</span>
                    ) : priceImpactSeverity > 2 ? (
                      <span>Swap Anyway</span>
                    ) : (
                      <span>Swap</span>
                    )}
                  </Text>
                </ButtonError>
              )}
              {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
            </div>
          </AutoColumn>
        </Wrapper>
      </AppBody>
      <SwitchLocaleLink />
      {!swapIsUnsupported ? null : (
        <UnsupportedCurrencyFooter show={swapIsUnsupported} currencies={[currencies.INPUT, currencies.OUTPUT]} />
      )}
    </>
  )
}
