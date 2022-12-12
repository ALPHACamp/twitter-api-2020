const dayjs = require('dayjs')
require('dayjs/locale/zh-tw')
dayjs.locale('zh-tw')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

module.exports = {
  relativeTime: a => dayjs(a).fromNow()
}
