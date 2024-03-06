const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
require('dayjs/locale/zh-tw')
dayjs.locale('zh-tw')
dayjs.extend(relativeTime)

module.exports = {
  absoluteTimeFormat: createdAt => {
    const nowFormat = dayjs(createdAt).format('Ah:mm・YYYY年MM月DD日')
    const chineseString = nowFormat.substring(0, 2) === 'AM' ? '上午' : '下午'
    const absoluteTime = nowFormat.replace(nowFormat.substring(0, 2), chineseString)
    return absoluteTime
  },
  relativeTimeFormat: createdAt => dayjs(createdAt).fromNow()
}
