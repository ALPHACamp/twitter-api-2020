const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

// image setting
const allowedFormats = ['image/jpg', 'image/jpeg', 'image/png']
const sizeLimit = 1048576


const imgurFileHandler = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    if (!allowedFormats.includes(file.mimetype))
      return reject(new Error(`File format not allowed. Allowed formats: ${allowedFormats.join(', ')}`))
    if (file.size > sizeLimit) return reject(new Error(`File size exceeds the limit of ${sizeLimit} bytes`))
    return imgur
      .uploadFile(file.path)
      .then((img) => {
        resolve(img?.link || null)
      })
      .catch((err) => reject(err))
  })
}

module.exports = imgurFileHandler
