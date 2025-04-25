import yfinance as yf

# Definir el ticker
ticker = 'AAPL'

# Obtener los datos históricos (velas japonesas)
data = yf.download(ticker, start="2020-01-01", end="2025-01-01", progress=False)

# Mostrar los primeros datos
print(data.head())