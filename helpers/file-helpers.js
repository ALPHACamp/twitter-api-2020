const imgur = require('imgur')
const sharp = require('sharp')

imgur.setClientId(process.env.IMGUR_CLIENT_ID)

const imgurFileHandler = async (file, type) => {
  if (!file) return null
  const resizeOptions = type === 'avatar'
    ? {
        width: 140,
        height: 140,
        fit: 'cover',
        position: sharp.strategy.attention
      }
    : {
        width: 1278,
        height: 400,
        fit: 'cover',
        position: sharp.strategy.entropy
      }
  const buffer = await sharp(file.path).resize(resizeOptions).toBuffer()
  const base64 = buffer.toString('base64')
  const img = await imgur.uploadBase64(base64)
  return img?.link || null
}

module.exports = {
  imgurFileHandler
}
