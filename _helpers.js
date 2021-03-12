const imgur = require('imgur')

function getUser(req) {
  return req.user;
}

const imgurUploadPromise = (file, clientId) => {
  return new Promise((resolve, reject) => {
    imgur.setClientId(clientId)
    imgur.uploadFile(file.path)
      .then(img => {
        return resolve(img)
      })
      .catch(err => reject('error'))
  })
}

module.exports = {
  getUser,
  imgurUploadPromise
};