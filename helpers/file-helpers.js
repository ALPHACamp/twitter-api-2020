const fs = require('fs') // 引入 fs (file system) 模組 (node.JS 中專門拿來處理檔案的模組)
const imgur = require('imgur')
// const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const IMGUR_CLIENT_ID = '252ea9997a22215'

imgur.setClientId(IMGUR_CLIENT_ID)

const localFileHandler = file => { // file 是 multer 處理完的檔案
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const fileName = `upload/${file.originalname}`
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}

const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)

    return imgur.uploadFile(file.path)
      .then(img => resolve(img?.link || null)) // 若 img 為 true (存在)，對 img 執行 .link (三元運算子的延伸)
      // 檢查時使用的寫法
      // .then(img => {
      //   console.log(img)
      //   // resolve(img && img.link) // 若 img 存在，會給 img link
      //   resolve(img?.link || null) // 若 img 為 true (存在)，對 img 執行 .link (三元運算子的延伸)
      // })
      .catch(err => reject(err))
  })
}

module.exports = {
  localFileHandler,
  imgurFileHandler
}
