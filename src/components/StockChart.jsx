import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ChartCanvas, Chart } from 'react-financial-charts'
import { BarSeries, CandlestickSeries } from 'react-financial-charts'
import { XAxis, YAxis } from 'react-financial-charts'
import { discontinuousTimeScaleProviderBuilder } from 'react-financial-charts'
import {
  CrossHairCursor,
  EdgeIndicator,
  CurrentCoordinate,
  MouseCoordinateX,
  MouseCoordinateY
} from '@react-financial-charts/coordinates'
import { OHLCTooltip } from '@react-financial-charts/tooltip'
import { format } from 'd3-format'
import { timeFormat } from 'd3-time-format'

const StockChart = ({ ticker, star_date, end_date }) => {
  const [yahooData, setData] = useState([])

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/api/analyze?ticker=${ticker}&start=${star_date}&end=${end_date}`
      )
      .then((response) => {
        let data = response.data
        console.log(response.data)

        data = data.map((item) => ({
          ...item,
          date: new Date(item.date)
        }))

        setData(data)
      })
      .catch((error) => {
        console.error('Error fetching data', error)
      })
  }, [ticker, star_date, end_date])
    
    const xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor((d) => d.date)
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(yahooData)

  return (
    <div>
      <h2>{ticker} Candlestick Chart</h2>
      <ChartCanvas
        height={700}
        width={1400}
        ratio={1}
        margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
        seriesName="Data"
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
      >
        <Chart
          id={2}
          yExtents={[(d) => d.volume]}
          height={150}
          origin={(w, h) => [0, h - 150]}
        >
          <YAxis
            axisAt="left"
            orient="left"
            ticks={5}
            tickFormat={format('.2s')}
          />

          <MouseCoordinateY
            at="left"
            orient="left"
            displayFormat={format('.4s')}
          />

          <BarSeries
            yAccessor={(d) => d.volume}
            fill={(d) => (d.close > d.open ? '#6BA583' : '#FF0000')}
          />

          <CurrentCoordinate yAccessor={(d) => d.volume} fill="#9B0A47" />

          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={(d) => d.volume}
            displayFormat={format('.4s')}
            fill="#0F0F0F"
          />
        </Chart>
        <Chart
          id={1}
          yExtents={[(d) => [d.high, d.low]]}
          padding={{ top: 40, bottom: 20 }}
        >
          <XAxis axisAt="bottom" orient="bottom" />
          <YAxis axisAt="right" orient="right" ticks={5} />

          <MouseCoordinateX
            rectWidth={60}
            at="bottom"
            orient="bottom"
            displayFormat={timeFormat('%H:%M:%S')}
          />
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format('.2f')}
          />

          <CandlestickSeries />
          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={(d) => d.close}
            fill={(d) => (d.close > d.open ? '#6BA583' : '#FF0000')}
          />

          <OHLCTooltip
            origin={[-40, 0]}
            xDisplayFormat={timeFormat('%Y-%m-%d %H:%M:%S')}
          />
        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    </div>
  )
}

export default StockChart
