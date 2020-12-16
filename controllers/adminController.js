const helpers = require('../_helpers')

const adminController = {
  readUsers: (req, res) => {
    res.send(`Hello Admin ${helpers.getUser(req).name}!`)
  },
  deleteTweet: (req, res) => {

  }
}

module.exports = adminController
