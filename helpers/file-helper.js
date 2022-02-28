// 引入模組
const imgur = require('imgur')

// 取出clintId變數
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
// imgur設定clientId
imgur.setClientId(IMGUR_CLIENT_ID)


// 圖片上傳至第三方_imgur
const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    // 沒有檔案，回傳null值
    if (!file) return resolve(null)

    // 上傳至imgur
    return imgur.uploadFile(file.path)
      .then(img => {
        // 成功上傳，回傳img.link，無則回傳null
        resolve(img ? img.link : null)
      })
      .catch(err => reject(err))
  })
}

// 匯出模組
module.exports = {
  imgurFileHandler
}
