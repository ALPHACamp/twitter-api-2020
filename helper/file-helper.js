require('dotenv').config()
const { ImgurClient } = require('imgur')
const client = new ImgurClient({ clientId: process.env.IMGUR_CLIENT })

const multerFilesHandler = (files) => {
  return new Promise((resolve, reject) => {
    if (!files) return resolve(null)
    console.log('files', files)
    const encodeImage1 = files.buffer.toString('base64')
    return client
      .upload({
        image: encodeImage1,
        type: 'base64',
        name: files.fieldname
      })
      .then((response1) => {
        if (response1.success) {
          return resolve(response1.data.link)
        } else {
          return reject(response1)
        }
      })
      .catch((error) => reject(error))
  })
}

module.exports = { multerFilesHandler }
