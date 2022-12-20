const fs = require('fs') // 引入 fs 模組
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID) // 匿名也可以上傳。有Client ID可讓上傳圖片被歸戶便於管理

// 將temp folder中file複製至本地端upload folder
const uploadLocal = file => { // file 是 multer 處理完的檔案
  // Promise找不到file就結束，有file就複製一份並回傳file name
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const fileName = `upload/${file.originalname}`
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}

// 將temp folder中file上傳至imgur
const uploadImgur = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur.uploadFile(file.path)
      .then(img => {
        resolve(img?.link || null) // 檢查 img 是否存在
      })
      .catch(err => reject(err))
  })
}
module.exports = {
  uploadLocal,
  uploadImgur
}
