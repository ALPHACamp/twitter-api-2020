const fs = require('fs')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

imgur.setClientId(IMGUR_CLIENT_ID)

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
  return new Promise((resolve, reject) => {
    if (!file.cover) return resolve(null)

    return imgur.uploadFile(file.cover[0].path)
      .then(img => {
        resolve(img?.link || null)
      })
      .catch(err => reject(err))
  })
}

const imgurAvatarHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file.avatar === undefined) return resolve(null)

    return imgur.uploadFile(file.avatar[0].path)
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
