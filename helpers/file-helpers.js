const imgur = require('imgur')
imgur.setClientId(process.env.IMGUR_CLIENT_ID)

const imgurFileHandler = async file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur.uploadFile(file.path)
      .then(img => {
        resolve(img?.link || null) // 檢查 img 是否存在
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  imgurFileHandler
}
