const chai = require('chai')
const chaiAsPromised = require("chai-as-promised");

const lib = require('../lib')
const formatDate = require('../lib/formatDate')

const { expect } = chai
chai.use(chaiAsPromised)

const MSEC_PER_DAY = 24 * 60 * 60 * 1000

const dateLessDays = days => new Date(Date.now() - days * MSEC_PER_DAY)

const isValidCurrentPrice = currencies => function (data) {
  expect(data).to.exist
  currencies.forEach(function (currency) {
    expect(data)
      .to.have.deep.property(`bpi.${currency}.rate_float`)
        .that.is.a('number')
  })
}

const isValidHistorical = (days, start, end) => function (data) {
  expect(data).to.have.property('bpi')
  const priceDays = Object.keys(data.bpi)
  expect(priceDays).to.have.length.of(days)
  priceDays.forEach(function (priceDay) {
    expect(data.bpi[priceDay]).to.be.a('number')
  })
  expect(priceDays).to.include(formatDate(start))
  expect(priceDays).to.include(formatDate(end))
}

describe('Coindesk BPI API', function () {
  it('should return supported currencies', function () {
    return lib.getSupportedCurrencies().then(function (data) {
      expect(data).to.be.an('array')
      expect(data).to.have.length.above(0)
      data.forEach(function (c) {
        expect(c).to.have.property('currency').that.is.a('string')
      })
    })
  })

  it('should return current price', function () {
    return lib.getCurrentPrice().then(
      isValidCurrentPrice(['USD', 'GBP', 'EUR'])
    )
  })

  it('should return current price for all supported currencies', function () {
    this.timeout(10000)
    return lib.getSupportedCurrencies().then(function (currencies) {
      return Promise.all(currencies.map(({ currency }) =>
        lib.getCurrentPrice(currency).then(
          isValidCurrentPrice(['USD', currency]))
        )
      )
    })
  })

  it('should fail when requesting the current price in an unsupported currency', function () {
    return expect(lib.getCurrentPrice('XXX'))
      .to.be.rejectedWith(Error, /not supported/)
  })

  it('should return historical data', function () {
    return lib.getHistoricalClosePrices().then(
      isValidHistorical(31, dateLessDays(31), dateLessDays(1))
    )
  })

  it('should return historical data for CNY index', function () {
    return lib.getHistoricalClosePrices({ index: 'CNY' }).then(
      isValidHistorical(31, dateLessDays(31), dateLessDays(1))
    )
  })

  it('should return historical data in EUR', function () {
    return lib.getHistoricalClosePrices({ currency: 'EUR' }).then(
      isValidHistorical(31, dateLessDays(31), dateLessDays(1))
    )
  })

  it('should return historical data for the last 5 days', function () {
    const days = 5
    const end = dateLessDays(1)
    const start = dateLessDays(days)
    return lib.getHistoricalClosePrices({ start, end }).then(
      isValidHistorical(days, start, end)
    )
  })

  it('should return historical data for yesterday', function () {
    return lib.getHistoricalClosePrices({ yesterday: true }).then(
      isValidHistorical(1, dateLessDays(1), dateLessDays(1))
    )
  })

  // the API returns the USD index for invalid indexes
  it.skip('should fail returning historical data for invalid indexes', function () {
    return expect(lib.getHistoricalClosePrices({ index: 'XXX' }))
      .to.be.rejectedWith(Error, /not supported/)
  })

  it('should fail returning historical data for invalid currencies', function () {
    return expect(lib.getHistoricalClosePrices({ currency: 'XXX' }))
      .to.be.rejectedWith(Error, /not found/)
  })
})
