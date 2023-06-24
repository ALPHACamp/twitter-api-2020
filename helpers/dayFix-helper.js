const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
require('dayjs/locale/zh-tw')
dayjs.extend(relativeTime)
dayjs.locale('zh-tw')

module.exports = {
  currentYear: () => dayjs().year(),
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  switchTime: a => dayjs(a).format('A hh:mm ． YYYY年MM月DD日')
}
