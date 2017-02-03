# CoinDesk Bitcoin Price Index API

[![Greenkeeper badge](https://badges.greenkeeper.io/gabmontes/node-coindesk-api.svg)](https://greenkeeper.io/)

Simple module to query the CoinDesk Bitcoin Price Index API

## Usage

```bash
$ npm install node-coindesk-api
```

Then, start querying the Coindesk API:

```js
const coindesk = require('node-coindesk-api')

coindesk.getCurrentPrice().then(function (data) {
  // data.bpi.USD.rate_float === 1015.0275 !!!
})
```

## API

- `getCurrentPrice()`: Returns current bitcoin prices.
- `getSupportedCurrencies()`: Returns all supported currencies.
- `getHistoricalClosePrices(options)`: Returns historical prices where `options` is an object with optional properties:
  - `index`: `USD` or `CNY`.
  - `index`: `USD` or `CNY`.
  - `currency`: any valid currency sting (see above).
  - `start`, `end`: `Date` objects
  - `yesterday`: boolean to shorten the query.

See [Coindesk BPI API docs](http://www.coindesk.com/api) for more information.

### Note on using the Coindesk BPI API

Read Coindesk's note on their [docs](http://www.coindesk.com/api):

> You are free to use this API to include our data in any application or website as you see fit, as long as each page or app that uses it includes the text “Powered by CoinDesk”, linking to our price page.

## License

WTFPL
