const fs = require('fs')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const imgurFileHandler = async file => {
  const img = await imgur.uploadFile(file.path)
  return img?.link || null
}

module.exports = imgurFileHandler
