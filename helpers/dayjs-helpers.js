const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
require('dayjs/locale/zh-tw')
dayjs.locale('zh-tw')
dayjs.extend(relativeTime)

module.exports = {
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  formatDate: a => dayjs(a).format('YYYY年MM月DD日'),
  formatTime: a => dayjs(a).format('A h:mm').replace('AM', '上午').replace('PM', '下午')
}
