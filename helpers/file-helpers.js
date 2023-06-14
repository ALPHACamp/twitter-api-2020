const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const imgurFileHandler = async file => {
  try {
    if (!file) return null
    const imgurHelpMe = await imgur.uploadFile(file.path)
    if (!imgurHelpMe?.link) return null
    return imgurHelpMe.link
  } catch (err) {
    return err
  }
}
module.exports = {
  imgurFileHandler
}
