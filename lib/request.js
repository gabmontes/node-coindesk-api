const rp = require('request-promise')

const baseUrl = 'http://api.coindesk.com/v1/bpi'

function request(path, qs) {
  return rp({ uri: `${baseUrl}${path}`, qs, json: true })
} 

module.exports = request
