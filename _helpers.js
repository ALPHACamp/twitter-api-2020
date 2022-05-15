const fs = require('fs')
// const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
// imgur.setClientId(IMGUR_CLIENT_ID)

function getUser(req) {
  return req.user;
}

function ensureAuthenticated(req) {
  return req.isAuthenticated()
}

const imgurFileHandler = file => {
  // return new Promise((resolve, reject) => {
  //   if (!file) return resolve(null)
  //   return imgur.uploadFile(file.path)
  //     .then(img => {
  //       resolve(img?.link || null)
  //     })
  //     .catch(err => reject(err))
  // })
}

module.exports = {
  getUser,
  ensureAuthenticated,
  imgurFileHandler
};