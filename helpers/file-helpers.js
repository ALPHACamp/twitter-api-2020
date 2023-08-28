const fs = require('fs') // 引入 fs 模組
const imgur = require('imgur')
imgur.setClientId(process.env.IMGUR_CLIENT_ID)

const localFileHandler = file => { // file 是 multer 處理完的檔案
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const fileName = `upload/${file.originalname}`
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile((fileName, data)))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}

const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur.uploadFile(file.path)
    .then(img => {
      resolve(img && img.link || null) // 檢查 img 是否存在
    })
    .catch(err => reject(err))
  })
}


module.exports = {
  localFileHandler,
  imgurFileHandler
}
