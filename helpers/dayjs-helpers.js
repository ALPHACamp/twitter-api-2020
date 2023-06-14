const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

module.exports = {
  relativeTimeFromNow: a => dayjs().to(a),
  switchTime: a => dayjs(a).format('A hh:mm ． YYYY年MM月DD日')
}