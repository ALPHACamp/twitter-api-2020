const fs = require('fs')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const localFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (file === undefined) return resolve(null)
    const fileName = `upload/${file[0].originalname}`
    return fs.promises.readFile(file[0].path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}
const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (file === undefined) return resolve(null)
    return imgur.uploadFile(file[0].path)
      .then(img => {
        resolve(img?.link || null)
      })
      .catch(err => reject(err))
  })
}
module.exports = {
  localFileHandler,
  imgurFileHandler
}
