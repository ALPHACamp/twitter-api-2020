const fs = require('fs') // 引入 fs 模組 （Node.js 提供專門來處理檔案的原生模組）
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur.uploadFile(file.path)
      .then(img => {
        resolve(img?.link || null) // 檢查 img 是否存在 寫成 object?.key，JavaScript 會先去幫我們檢查符號前面這個 object 值存不存在。存在才往下取值 object.key，不存在就直接回傳 undefined
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  imgurFileHandler
}
