const bcrypt = require('bcryptjs')
const { User } = require('../models')
const userController = {
  signIn: (req, res, next) => {

  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exist!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        account: req.body.account,
        role: 'user'
      }))
      .then(newUser => {
        const userJSON = newUser.toJSON()
        delete userJSON.password
        return res.json({ status: 'success', data: { user: userJSON } })
      })
      .catch(err => {
        next(err)
      })
  }
}

module.exports = userController
