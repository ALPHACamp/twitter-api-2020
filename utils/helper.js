const moment = require('moment')

function formatTime(time) {
  return moment(time).format('YYYY-MM-DD hh:mm:ss a')
}

module.exports = {
  formatTime
}
