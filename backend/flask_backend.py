from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd

app = Flask(__name__)
CORS(app)  # Habilita CORS para comunicar con React
VALID_INTERVALS = ['1m', '2m', '5m', '15m', '30m', '60m', '90m', '1h', '4h', '1d', '5d', '1wk', '1mo', '3mo']

@app.route('/api/analyze', methods=['GET'])
def analyze():
    ticker = request.args.get('ticker')
    interval = request.args.get('interval', '4h')
    period = request.args.get('period', '60d')
    
    if interval not in VALID_INTERVALS:
        return jsonify({'error': f'Invalid interval "{interval}". Must be one of: {VALID_INTERVALS}'}), 400
    
    data = yf.download(ticker, interval=interval, period=period)
    
    if data.empty:
        return jsonify({'error': f'No data found for {ticker} with interval {interval} and period {period}.'}), 404
    
    if isinstance(data.columns, pd.MultiIndex):
        data.columns = [key for key, value in data.columns.values]

    data.reset_index(inplace=True)
    data.columns = map(str.lower, data.columns)
    result = data[['datetime', 'open', 'high', 'low', 'close', 'volume']].to_dict(orient='records')

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
