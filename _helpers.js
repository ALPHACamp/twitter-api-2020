function getUser (req) {
  return req.user || null
}

const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const imgurFileHandler = file => {
  if (!file) return null
  return new Promise((resolve, reject) => {
    return imgur.uploadFile(file.path)
      .then(img => {
        resolve(img?.link || null)
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  getUser,
  imgurFileHandler
}
