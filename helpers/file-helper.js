const imgur = require('imgur')
imgur.setClientId(process.env.IMGUR_CLIENT_ID)

module.exports = {
  imgurFileHandler: file => {
    return new Promise((resolve, reject) => {
      if (!file) return resolve(null)
      return imgur.uploadFile(file.path)
        .then(img => {
          resolve(img?.link || null) // 檢查 img 是否存在
        })
        .catch(err => reject(err))
    })
  }
}
