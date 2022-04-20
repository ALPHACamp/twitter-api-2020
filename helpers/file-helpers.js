const fs = require('fs') // 引入 fs 模組
const multer = require('multer')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

imgur.setClientId(IMGUR_CLIENT_ID)

const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') return reject(new Error('Only JPEG and PNG are allow!'))
    if (file.size > 8 * 1024 * 1024) return reject(new Error('The file size must not exceed 8MB!'))
    return imgur.uploadFile(file.path)
      .then(img => {
        resolve(img.link || null) // 檢查 img 是否存在
      })
      .catch(err => {
        reject(err)
      })
  })
}

module.exports = {
  imgurFileHandler
}
