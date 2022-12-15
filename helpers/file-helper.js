const { ImgurClient } = require('imgur')
const { createReadStream } = require('fs')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const IMGUR_CLIENT_SECRET = process.env.IMGUR_CLIENT_SECRET
const IMGUR_REFRESH_TOKEN = process.env.IMGUR_REFRESH_TOKEN
const IMGUR_ALBUM_ID = process.env.IMGUR_ALBUM_ID

const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)

    const client = new ImgurClient({
      clientId: IMGUR_CLIENT_ID,
      clientSecret: IMGUR_CLIENT_SECRET,
      refreshToken: IMGUR_REFRESH_TOKEN
    })
    return client.upload({
      image: createReadStream(file.path),
      type: 'stream',
      album: IMGUR_ALBUM_ID
    }).then(res => {
      resolve(res?.data?.link || null)
    }).catch(err => reject(err))
  })
}
module.exports = {
  imgurFileHandler
}
