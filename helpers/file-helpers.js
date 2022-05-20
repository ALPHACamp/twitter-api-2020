const fs = require('fs') // 引入 fs 模組
const imgur = require('imgur')
imgur.setClientId(process.env.IMGUR_CLIENT_ID)
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
const imgurCoverHandler = file => {
  if (file === undefined) return null
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line dot-notation
    if (file['cover'] === undefined) return resolve(null)
    // eslint-disable-next-line dot-notation
    return imgur.uploadFile(file['cover'][0].path)
      .then(img => {
        resolve(img?.link || null)
      })
      .catch(err => reject(err))
  })
}
const imgurAvatarHandler = file => {
  if (file === undefined) return null
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line dot-notation
    if (file['avatar'] === undefined) return resolve(null)
    // eslint-disable-next-line dot-notation
    return imgur.uploadFile(file['avatar'][0].path)
      .then(img => {
        resolve(img?.link || null)
      })
      .catch(err => reject(err))
  })
}
module.exports = {
  localFileHandler,
  imgurCoverHandler,
  imgurAvatarHandler
}
