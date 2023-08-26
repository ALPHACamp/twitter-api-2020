const dayjs = require('dayjs')
// 使用中文
require('dayjs/locale/zh-tw')
dayjs.locale('zh-tw')

const relativeTime = require('dayjs/plugin/relativeTime')

dayjs.extend(relativeTime)

module.exports = {
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  simpleTime: a => dayjs(a).format('A hh:mm'),
  simpleDate: a => dayjs(a).format('YYYY年MM月DD日')
}
