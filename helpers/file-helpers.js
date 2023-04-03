
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

// const imgurFileHandler = file => {
//   return new Promise((resolve, reject) => {
//     if (!file) return resolve(null)
//     return imgur.uploadFile(file.path).then(img => {
//       resolve(img?.link || null) // 檢查img是否存在，有的話使用img.link, 沒有則null
//     })
//       .catch(err => reject(err))
//   })
// }

const imgurFileHandler = files => {
  return new Promise((resolve, reject) => {
    if (!files) return resolve(null)
    return imgur.uploadFile(files[0].path)
      .then(img => {
        resolve(img?.link || null) // 檢查 img 是否存在
      })
      .catch(err => reject(err))
  })
}


module.exports = {
  imgurFileHandler
}
