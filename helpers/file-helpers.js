
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
    const promises = []
    for (const key in files) {
      promises.push(imgur.uploadFile(files[key][0].path))
    }
    return Promise.all(promises)
      .then(imgs => {
        const links = []
        imgs.forEach(img => {
          links.push(img?.link || null)
        })
        resolve(links)
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  imgurFileHandler
}
