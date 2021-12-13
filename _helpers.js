const imgur = require('imgur-node-api')

function getUser(req) {
  return req.user
}

function imgurUpload(path) {
  return new Promise((resolve, reject) => {
    imgur.upload(path, (err, img) => {
      resolve(img.data.link)
    })
  })
}

module.exports = {
  getUser,
  imgurUpload
}
