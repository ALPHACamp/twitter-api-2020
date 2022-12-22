if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}
const fs = require('fs')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
// const { ImgurClient,imgur } = require('imgur');
// const client = new ImgurClient({ clientId: process.env.CLIENT_ID });


function getUser (req) {
  return req.user
}

const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    console.log('有進file',file)
    if (!file) return resolve(null)
    return imgur.uploadFile(file.path)
      .then(img => {
        console.log('未進handleler',img)
        resolve(img?.link || null)
      })
      .catch(err => reject(err))
  })
}

const localFileHandler = file => { // file 是 multer 處理完的檔案
  return new Promise((resolve, reject) => {
    console.log('is inlocal')
    if (!file) return resolve(null) 
    const fileName = `upload/${file.originalname}`
    console.log('filwName',fileName)
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}

module.exports = {
	getUser,
  imgurFileHandler,
  localFileHandler
}
