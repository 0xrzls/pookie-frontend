import React, { ReactNode, useCallback, useMemo } from 'react'

import { Currency, Price, Token } from 'dependencies/sdk-core'
import { AutoColumn, ColumnCenter } from 'components/Column'
import Loader from 'components/Loader'
import { useColor } from 'hooks/useColor'
import useTheme from 'hooks/useTheme'
import { saturate } from 'polished'
import { BarChart2, Inbox, CloudOff } from 'react-feather'
import { batch } from 'react-redux'
import styled from 'styled-components/macro'
import { TYPE } from '../../theme'
import { Chart } from './Chart'
import { useDensityChartData } from './hooks'
import { format } from 'd3'
import { Bound } from 'state/mint/v3/actions'
import { FeeAmount } from 'dependencies/v3-sdk'
import { Text } from 'rebass'

const ChartWrapper = styled.div`
  position: relative;

  justify-content: center;
  align-content: center;
`

function InfoBox({ message, icon }: { message?: ReactNode; icon: ReactNode }) {
  return (
    <ColumnCenter style={{ height: '100%', justifyContent: 'center' }}>
      {icon}
      {message && (
        <TYPE.mediumHeader padding={10} marginTop="20px">
          {message}
        </TYPE.mediumHeader>
      )}
    </ColumnCenter>
  )
}

export default function LiquidityChartRangeInput({
  currencyA,
  currencyB,
  feeAmount,
  ticksAtLimit,
  price,
  priceLower,
  priceUpper,
  onLeftRangeInput,
  onRightRangeInput,
  interactive,
}: {
  currencyA: Currency | undefined
  currencyB: Currency | undefined
  feeAmount?: number
  ticksAtLimit: { [bound in Bound]?: boolean | undefined }
  price: number | undefined
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  onLeftRangeInput: (typedValue: string) => void
  onRightRangeInput: (typedValue: string) => void
  interactive: boolean
}) {
  const theme = useTheme()

  const tokenAColor = useColor(currencyA?.wrapped)
  const tokenBColor = useColor(currencyB?.wrapped)

  const { isLoading, isUninitialized, isError, error, formattedData } = useDensityChartData({
    currencyA,
    currencyB,
    feeAmount,
  })

  const onBrushDomainChangeEnded = useCallback(
    (domain: any) => {
      const leftRangeValue = Number(domain[0])
      const rightRangeValue = Number(domain[1])

      batch(() => {
        // simulate user input for auto-formatting and other validations
        leftRangeValue > 0 && onLeftRangeInput(leftRangeValue.toFixed(6))
        rightRangeValue > 0 && onRightRangeInput(rightRangeValue.toFixed(6))
      })
    },
    [onLeftRangeInput, onRightRangeInput]
  )

  interactive = interactive && Boolean(formattedData?.length)

  const brushDomain: [number, number] | undefined = useMemo(() => {
    const isSorted = currencyA && currencyB && currencyA?.wrapped.sortsBefore(currencyB?.wrapped)

    const leftPrice = isSorted ? priceLower : priceUpper?.invert()
    const rightPrice = isSorted ? priceUpper : priceLower?.invert()

    return leftPrice && rightPrice
      ? [parseFloat(leftPrice?.toSignificant(5)), parseFloat(rightPrice?.toSignificant(5))]
      : undefined
  }, [currencyA, currencyB, priceLower, priceUpper])

  const brushLabelValue = useCallback(
    (d: 'w' | 'e', x: number) => {
      if (!price) return ''

      if (d === 'w' && ticksAtLimit[Bound.LOWER]) return '0'
      if (d === 'e' && ticksAtLimit[Bound.UPPER]) return '∞'

      const percent = (((x < price ? -1 : 1) * (Math.max(x, price) - Math.min(x, price))) / Math.min(x, price)) * 100

      return price ? `${format(Math.abs(percent) > 1 ? '.2~s' : '.2~f')(percent)}%` : ''
    },
    [price, ticksAtLimit]
  )

  return (
    <AutoColumn gap="md" style={{ minHeight: '200px', backgroundColor: '#F5F5F5', borderRadius: '16px' }}>
      {isUninitialized ? (
        <InfoBox
          message={<Text color={'#1E1E1E'}>Your position will appear here.</Text>}
          icon={<Inbox size={56} stroke={theme.text1} />}
        />
      ) : isLoading ? (
        <InfoBox icon={<Loader size="40px" stroke={theme.text4} />} />
      ) : isError ? (
        <InfoBox
          message={<span>Liquidity data not available.</span>}
          icon={<CloudOff size={56} stroke={theme.text4} />}
        />
      ) : // @ts-ignore
      !formattedData || formattedData === [] || !price ? (
        <InfoBox
          message={<span>There is no liquidity data.</span>}
          icon={<BarChart2 size={56} stroke={theme.text4} />}
        />
      ) : (
        <ChartWrapper>
          <Chart
            data={{ series: formattedData, current: price }}
            dimensions={{ width: 400, height: 200 }}
            margins={{ top: 10, right: 2, bottom: 20, left: 0 }}
            styles={{
              area: {
                selection: theme.blue1,
              },
              brush: {
                handle: {
                  west: saturate(0.1, tokenAColor) ?? theme.red1,
                  east: saturate(0.1, tokenBColor) ?? theme.blue1,
                },
              },
            }}
            interactive={interactive}
            brushLabels={brushLabelValue}
            brushDomain={brushDomain}
            onBrushDomainChange={onBrushDomainChangeEnded}
            initialZoom={feeAmount === FeeAmount.LOW ? 0.02 : 0.3}
          />
        </ChartWrapper>
      )}
    </AutoColumn>
  )
}
