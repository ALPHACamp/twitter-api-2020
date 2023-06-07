const bcrypt = require('bcryptjs') // 載入 bcrypt
const { User } = require('../models')
const userController = {
  signUp: (req, cb) => {
    console.log(req.body)
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        console.log(user)
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10) 
      })
      .then(hash => User.create({ 
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(user => {
        return cb(null, { user })
      })
      .catch(err => cb(err))
  }
}

module.exports = userController
