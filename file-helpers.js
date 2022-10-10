// const imgur = require('imgur')
// const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
// imgur.setClientId(IMGUR_CLIENT_ID)

const fs = require('fs')

const localFileHandler = files => { // file 是 multer 處理完的檔案
  files.forEach()
  return new Promise((resolve, reject) => {
    if (!files.avatar[0]) return resolve(null)
    const fileName = `upload/${files.avatar[0].originalname}`
    return fs.promises.readFile(files.avatar[0].path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}
module.exports = {
  localFileHandler
}