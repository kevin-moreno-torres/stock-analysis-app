import mplfinance as mpf
import yfinance as yf

# Obtener datos históricos de AAPL
data = yf.download('AAPL', start="2020-01-01", end="2025-01-01")

# Configurar el gráfico de velas
mpf.plot(data, type='candle', style='charles', title='AAPL - Velas Japonesas', ylabel='Precio ($)', volume=True)
