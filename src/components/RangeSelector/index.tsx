import { Currency, Price, Token } from 'dependencies/sdk-core'
import StepCounter from 'components/InputStepCounter/InputStepCounter'
import { RowBetween } from 'components/Row'
import { AutoColumn } from 'components/Column'
import { Bound } from 'state/mint/v3/actions'
import { formatTickPrice } from 'utils/formatTickPrice'

// currencyA is the base token
export default function RangeSelector({
  priceLower,
  priceUpper,
  onLeftRangeInput,
  onRightRangeInput,
  getDecrementLower,
  getIncrementLower,
  getDecrementUpper,
  getIncrementUpper,
  currencyA,
  currencyB,
  feeAmount,
  ticksAtLimit,
}: {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  getDecrementLower: () => string
  getIncrementLower: () => string
  getDecrementUpper: () => string
  getIncrementUpper: () => string
  onLeftRangeInput: (typedValue: string) => void
  onRightRangeInput: (typedValue: string) => void
  currencyA?: Currency | null
  currencyB?: Currency | null
  feeAmount?: number
  ticksAtLimit: { [bound in Bound]?: boolean | undefined }
}) {
  const tokenA = (currencyA ?? undefined)?.wrapped
  const tokenB = (currencyB ?? undefined)?.wrapped
  const isSorted = tokenA && tokenB && tokenA.sortsBefore(tokenB)

  const leftPrice = isSorted ? priceLower : priceUpper?.invert()
  const rightPrice = isSorted ? priceUpper : priceLower?.invert()

  return (
    <AutoColumn gap="md">
      <RowBetween>
        <StepCounter
          value={formatTickPrice(leftPrice, ticksAtLimit, Bound.LOWER, '')}
          onUserInput={onLeftRangeInput}
          width="48%"
          decrement={isSorted ? getDecrementLower : getIncrementUpper}
          increment={isSorted ? getIncrementLower : getDecrementUpper}
          decrementDisabled={ticksAtLimit[Bound.LOWER]}
          incrementDisabled={ticksAtLimit[Bound.LOWER]}
          feeAmount={feeAmount}
          label={leftPrice ? `${currencyB?.symbol}` : '-'}
          title={<span>Min Price</span>}
          tokenA={currencyA?.symbol}
          tokenB={currencyB?.symbol}
        />
        <StepCounter
          value={formatTickPrice(rightPrice, ticksAtLimit, Bound.UPPER, '')}
          onUserInput={onRightRangeInput}
          width="48%"
          decrement={isSorted ? getDecrementUpper : getIncrementLower}
          increment={isSorted ? getIncrementUpper : getDecrementLower}
          incrementDisabled={ticksAtLimit[Bound.UPPER]}
          decrementDisabled={ticksAtLimit[Bound.UPPER]}
          feeAmount={feeAmount}
          label={rightPrice ? `${currencyB?.symbol}` : '-'}
          tokenA={currencyA?.symbol}
          tokenB={currencyB?.symbol}
          title={<span>Max Price</span>}
        />
      </RowBetween>
    </AutoColumn>
  )
}
