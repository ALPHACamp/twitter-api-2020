const imgur = require('imgur')
imgur.setClientId(process.env.IMGUR_CLIENTID)

imgur.setClientId(process.env.IMGUR_CLIENT_ID)
const imgurFileHandler = (files) => {
  const images = [files?.avatar?.[0]?.path, files?.banner?.[0]?.path]
  const uploadPromises = images.map(file => {
    return new Promise((resolve, reject) => {
      if (!file) return resolve(null)
      return imgur.uploadFile(file)
        .then(img => {
          resolve(img?.link || null)
        })
        .catch(err => reject(err))
    })
  })
  return Promise.all(uploadPromises)
}
module.exports = {
  imgurFileHandler
}
