
const { ImgurClient } = require('imgur')
const fs = require('fs')

// imgur 2.X版作法
const client = new ImgurClient({
  clientId: process.env.IMGUR_CLIENT_ID,
  clientSecret: process.env.IMGUR_CLIENT_SECRET,
  refreshToken: process.env.IMGUR_CLIENT_REFRESH_TOKEN
})

const imgurFileHandler = async function (file) {
  try {
    if (!file) return null
    const response = await client.upload({
      image: fs.createReadStream(file.path),
      type: 'stream',
      album: process.env.IMGUR_ALBUM_ID
    })

    return response?.data.link || null
  } catch (err) {
    return Promise.reject(err)
  }
}

// // imgur 1.X版作法
// const imgur = require('imgur')
// imgur.setClientId(process.env.IMGUR_CLIENT_ID)

// const imgurFileHandler = file => {
//   return new Promise((resolve, reject) => {
//     if (!file) return resolve(null)
//     return imgur.uploadFile(file.path) // 將multer放在temp中的檔案上傳至imgur雲
//       .then(img => resolve(img?.link || null)) // 若img存在則回傳img.link
//       .catch(err => reject(err))
//   })
// }

module.exports = imgurFileHandler
