if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}
const fs = require('fs')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID


function getUser (req) {
  return req.user
}

const imgurFileHandler = file => {
  return new Promise(async (resolve, reject) => {
    if (!file) return resolve(null)
    const img = await imgur.uploadFile(file.path)
      .then((img) => {
        resolve(img?.link || null)
      })
      .catch(err => reject(err))    
    return img
  })
}

// const localFileHandler = file => { // file 是 multer 處理完的檔案
//   return new Promise((resolve, reject) => {
//     console.log('is inlocal')
//     if (!file) return resolve(null) 
//     const fileName = `upload/${file.originalname}`
//     console.log('filwName',fileName)
//     return fs.promises.readFile(file.path)
//       .then(data => fs.promises.writeFile(fileName, data))
//       .then(() => resolve(`/${fileName}`))
//       .catch(err => reject(err))
//   })
// }

module.exports = {
	getUser,
  imgurFileHandler,
  // localFileHandler
}
