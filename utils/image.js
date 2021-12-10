const imgur = require('imgur-node-api')

const uploadImage = imagePath => {
  return new Promise((resolve, reject) => {
    imgur.upload(imagePath, (err, img) => {
      if (err) {
        return reject(err)
      }
      resolve(img)
    })
  })
}

module.exports = uploadImage
