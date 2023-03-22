const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

imgur.setClientId(IMGUR_CLIENT_ID)

const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)

    return imgur
      .uploadFile(file.path)
      .then(img => {
        resolve(img?.link || null) // 檢查 img 是否存在
      })
      .catch(err => reject(err))
  })
}

function getUser (req) {
  return req.user || null
}

function ensureAuthenticated (req) {
  return req.isAuthenticated()
}

module.exports = {
  getUser,
  ensureAuthenticated,
  imgurFileHandler
}
