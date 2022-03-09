const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const imgurFileHandler = (file, res) => {
  return new Promise((resolve, reject) => {
    if (file === undefined) return resolve(null)
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
      return res.status(400).json({ message: 'PNG & JPEG only.' })
    }
    return imgur.uploadFile(file.path)
      .then(img => {
        const imgLink = img ? img.link : null
        resolve(imgLink)
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  imgurFileHandler
}
