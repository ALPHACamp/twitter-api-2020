const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

// image setting
const allowedFormats = ['image/jpg', 'image/jpeg', 'image/png']
const sizeLimit = 1048576

const imgurFileHandler = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    if (!allowedFormats.includes(file.mimetype)) {
      return reject(new Error(`檔案格式不允許，允許的格式為：${allowedFormats.join(', ')}`))
    }
    if (file.size > sizeLimit) 
    return reject(new Error(`檔案大小超過限制，上限為 ${sizeLimit} bytes`))
    return imgur
      .uploadFile(file.path)
      .then((img) => {
        resolve(img?.link || null)
      })
      .catch((err) => reject(err))
  })
}

module.exports = imgurFileHandler
