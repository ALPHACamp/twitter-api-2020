const helpers = require('../_helpers')
const db = require('../models')
const User = db.User


const chatServices = {
  getChatRoom: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    User.findByPk(USERID)
      .then(user => {
        return callback(user)
      })
  }
}

module.exports = chatServices