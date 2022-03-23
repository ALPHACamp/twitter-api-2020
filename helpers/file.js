const imgur = require('imgur-node-api')
imgur.setClientID(process.env.IMGUR_CLIENT_ID)

const uploadFile = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    imgur.upload(file.path, (err, img) => {
      if (err) return reject(err)
      resolve(img.data.link)
    })
  })
}

module.exports = uploadFile
