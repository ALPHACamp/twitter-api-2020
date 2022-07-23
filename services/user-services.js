const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { User } = require('../models')

const userServices = {
  signUp: (req, cb) => {
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')

        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => {
        return User.create({
          account: req.body.account,
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      })
      .then(newUser => {
        const data = newUser.toJSON()
        delete data.password
        return cb(null, { user: data })
      })
      .catch(err => cb(err))
  },
  signIn: (req, cb) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return cb(null, { token, user: userData })
    } catch (err) {
      return cb(err)
    }
  }
}

module.exports = userServices
