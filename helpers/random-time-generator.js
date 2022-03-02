const moment = require('moment')

// 產生隨機時間
function randomTime() {

  const startDate = moment().startOf('month').toDate()
  const endDate = new Date()

  const date = new Date(+startDate + Math.random() * (endDate - startDate))
  const hour = 0 + Math.random() * (23 - 0) | 0
  const minute = 0 + Math.random() * (59 - 0) | 0
  const second = 0 + Math.random() * (59 - 0) | 0

  date.setHours(hour)
  date.setMinutes(minute)
  date.setSeconds(second)
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

exports = module.exports = {
  randomTime
}
