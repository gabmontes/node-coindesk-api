function formatDate(date) {
  return date.toISOString().substr(0, 10)
}

module.exports = formatDate
