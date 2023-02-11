const dayjs = require('dayjs')
require('dayjs/locale/zh-tw')
dayjs.locale('zh-tw') // 使用中文
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

module.exports = {
  relativeTime: a => dayjs(a).fromNow(),
  tweetSimplifyTime: a => dayjs(a).format('A hh:mm'),
  tweetDetailTime: a => dayjs(a).format('YYYY年M月D日')
}
