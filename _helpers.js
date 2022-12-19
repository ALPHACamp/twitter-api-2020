const fs = require('fs')
const imgur = require('imgur')

function getUser (req) {
  return req.user
}

const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur.uploadFile(file.path)
      .then(img => {
        resolve(img?.link || null)
      })
      .catch(err => reject(err))
  })
}

module.exports = {
	getUser,
  imgurFileHandler
}
