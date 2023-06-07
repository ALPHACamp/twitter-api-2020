const bcrypt = require('bcryptjs')
const { User } = require('../../models')
const jwt = require('jsonwebtoken')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      if (role === 'admin') throw new Error('帳號不存在！')
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      res.status(500).json({ status: 'error', error: err.message })
    }
  },
  signUp: (req, res, next) => {
    new Promise((resolve, reject) => {
      if (req.body.password != req.body.passwordCheck) reject(new Error('Password do not match'))
      resolve()
    })

      .then(() => User.findOne({ where: { email: req.body.email } }))
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => {
        return User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      })
      .then((user) => {
        user = user.toJSON()
        delete user.password
        res.json({ status: 'success', data: { user } })
      })
      .catch(err => {
        res.status(500).json({ status: 'error', error: err.message })
      })
  },
}

module.exports = userController