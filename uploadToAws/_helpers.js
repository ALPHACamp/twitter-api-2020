// date-helpers
const dayjs = require('dayjs')
require('dayjs/locale/zh-tw')
dayjs.locale('zh-tw')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

// file-helpers
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)
const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur.uploadFile(file.path)
      .then(img => { resolve(img?.link || null) })
      .catch(err => reject(err))
  })
}

// getUser
function getUser (req) {
  return req.user
}

module.exports = {
  getUser,
  relativeTime: a => dayjs(a).fromNow(),
  date: date => dayjs(date),
  imgurFileHandler
}
