const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
require('dayjs/locale/zh-tw')
dayjs.locale('zh-tw')
dayjs.extend(relativeTime)

module.exports = {
  relativeTimeFormat: createdAt => dayjs(createdAt).fromNow()
}
