import React from 'react'
import StockChart from './components/StockChart'

const tickers = ['AAPL', 'MSFT', 'PSTV', 'TMDX']
let endDate = new Date()
endDate.setDate(endDate.getDate() + 1)
const formattedEndDate = endDate.toISOString().split('T')[0]
let starDate = '2025-01-01'


function App() {
  return (
    <div className="App">
      <h1>Analisis de Velas Japonesas</h1>
      {tickers.map((ticker) => (
        <StockChart
          key={ticker}
          ticker={ticker}
          star_date={starDate}
          end_date={formattedEndDate}
        />
      ))}
    </div>
  )
}

export default App
