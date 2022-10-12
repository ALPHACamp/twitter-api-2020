const fs = require('fs')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)
// 上傳圖檔至本機儲存
const localFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const fileName = `upload/${file.originalname}`
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}
// 上傳圖檔至imgur api儲存
const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur.uploadFile(file.path)
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
