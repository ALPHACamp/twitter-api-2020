const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

imgur.setClientId(IMGUR_CLIENT_ID)

const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') return reject(new Error('只接受PNG和JPEG檔'))
    if (file.size > 8 * 1024 * 1024) return reject(new Error('檔案不成超過8mb'))
    return imgur.uploadFile(file.path)
      .then(img => {
        resolve(img.link || null)
      })
      .catch(err => {
        reject(err)
      })
  })
}

module.exports = {
  imgurFileHandler
}
