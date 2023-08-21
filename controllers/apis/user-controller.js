const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userController = {
  signUp: (req, res) => {
    // 待完成
    bcrypt
      .hash(req.body.password, 10)
      .then(hash =>
        User.create({
          account: req.body.account,
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      )
      .then(() => {
        res.redirect('api/users/signin')
      })
  }
}
module.exports = userController
