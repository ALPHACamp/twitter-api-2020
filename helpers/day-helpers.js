const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

module.exports = {
  relativeTimeFormat: createdAt => dayjs(createdAt).fromNow()
}
