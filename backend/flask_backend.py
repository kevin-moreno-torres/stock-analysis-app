from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd

app = Flask(__name__)
CORS(app)  # Habilita CORS para comunicar con React

@app.route('/api/analyze', methods=['GET'])
def analyze():
    ticker = request.args.get('ticker')
    start = request.args.get('start')
    end = request.args.get('end')
    data = yf.download(ticker, start, end)
    
    if isinstance(data.columns, pd.MultiIndex):
        data.columns = [key for key, value in data.columns.values]

    data.reset_index(inplace=True)
    data.columns = map(str.lower, data.columns)
    result = data[['date', 'open', 'high', 'low', 'close', 'volume']].to_dict(orient='records')

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
