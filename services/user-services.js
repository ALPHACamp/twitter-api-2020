const { User } = require('../models')
const bcrypt = require('bcryptjs')
const userServices = {
  signUp: (req, cb) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    return Promise.all([
      User.findOne({ where: { email: req.body.email } }),
      User.findOne({ where: { account: req.body.account } })
    ])
      .then(([email, account]) => {
        if (email) throw new Error('Email already exists!')
        if (account) throw new Error('Account already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then((createdUser) => {
        createdUser = createdUser.toJSON()
        delete createdUser.password
        return cb(null, { user: createdUser })
      })
      .catch(err => cb(err))
  }
}
module.exports = userServices