const imgur = require('imgur')
imgur.setClientId(process.env.IMGUR_CLIENT_ID)

module.exports = {
  imgurFileHandler: async files => {
    try {
      if (!files) return null
      const images = {}
      for (const key in files) {
        const [{ path }] = files[key]
        const img = await imgur.uploadFile(path)
        images[key] = img?.link || null
      }
      return images
    } catch (err) {
      return (err)
    }
  }
}
