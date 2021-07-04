const db = require('../models')
const User = db.User

const userServer = {
  signInPage: (req, res) => {
    return res.render('signin')
  }
}

module.exports = userServer