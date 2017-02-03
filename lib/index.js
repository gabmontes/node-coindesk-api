if (!Array.prototype.includes) {
  require('core-js/fn/array/includes')
}

const request = require('./request')
const formatDate = require('./formatDate')

// memoize 1'
function getSupportedCurrencies() {
  return request('/supported-currencies.json')
}

// memoize 1' TTL 15"
function getCurrentPrice(currency) {
  if (!currency) {
    return request('/currentprice.json')
  }

  return request(`/currentprice/${currency}.json`)
}

// memoize 1' TTL 15"
function getHistoricalClosePrices(options = {}) {
  const { index, currency, start, end, yesterday } = options

  return request(`/historical/close.json`, {
    index,
    currency,
    start: start && end && formatDate(start) || undefined,
    end: start && end && formatDate(end) || undefined,
    for: yesterday ? 'yesterday' : undefined
  })
}

module.exports = {
  getCurrentPrice,
  getSupportedCurrencies,
  getHistoricalClosePrices
}
