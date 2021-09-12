const db = require('../../models')
const User = db.User

const userController = {
  signUp: (req, res) => {
    // confirm password
    if (req.body.password !== req.body.checkPassword) {
      return res.json('error', 'Inconsistent password!')
    } else {
      return Promise.all([
        // confirm unique user by email and account
        User.findOne({ where: { email: req.body.email } }).then(user => {
          if (user) {
            return res.json('error', 'This email is already registered')
          }
        }),
        User.findOne({ where: { account: req.body.account.trim } }).then(user => {
          if (user) {
            res.json('error', 'This account has already been used.')
          }
        })
      ]).then(user => {
        User.create({
          account: req.body.account,
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
          checkPassword = req.body.checkPassword
        })
      }).then(user => {
        res.json('success', 'Registration successful')
      })
    }
  }
}

module.exports = userController
