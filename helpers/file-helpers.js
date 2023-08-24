const imgur = require('imgur')
imgur.setClientId(process.env.IMGUR_CLIENTID)

const imgurFileHandler = async (files) => {
  const uploadPromises = []
  const images = [files?.avatar?.[0]?.path, files?.banner?.[0]?.path]
  try {
    for (const file of images) {
      if (!file) return uploadPromises.push(null)
      const img = await imgur.uploadFile(file)
      uploadPromises.push(img?.link || null)
    }
  } catch (err) {
    console.log(err.message)
  }
  return uploadPromises
}
module.exports = {
  imgurFileHandler
}
