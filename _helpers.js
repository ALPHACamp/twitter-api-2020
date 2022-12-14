const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

imgur.setClientId(IMGUR_CLIENT_ID)

const getUser = req => {
  return req.user || null
}

const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur.uploadFile(file.path)
      .then(img => {
        return resolve(img?.link || null)
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  getUser,
  imgurFileHandler
}
