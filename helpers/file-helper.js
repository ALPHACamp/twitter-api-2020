const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const imgurFileHandler = files => {
  return new Promise((resolve, reject) => {
    if (!files) return resolve(null)
    const allFiles = [...Object.values(files)]
    Promise.all([
      imgur.uploadFile(allFiles[0][0].path),
      imgur.uploadFile(allFiles[1][0].path)
    ])
      .then(([avatar, backgrounImage]) => {
        resolve([avatar?.link || null, backgrounImage?.link || null])
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  imgurFileHandler
}
