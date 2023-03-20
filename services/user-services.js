const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userServices = {
  signUp: (req, cb) => {
    const { account, name, email, password } = req.body
    User.findOne({ where: { account: req.body.account } })
    return bcrypt.hash(password, 10)
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash
      }))
      .then(newUser => cb(null, { user: newUser }))
      .catch(err => cb(err))
  }
}

module.exports = userServices
