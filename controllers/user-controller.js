const jwt = require('jsonwebtoken')
const { User } = require('../models')
const bcrypt = require('bcryptjs')
const userController = {
  loginUser: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  registerUser: (req, res, next) => {
    // password check
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    // account and email check
    Promise.all([
      User.findOne({ where: { account: req.body.account } }), User.findOne({ where: { email: req.body.email } })
    ])
      .then(([userWithAccount, userWithEmail]) => {
        if (userWithAccount) throw new Error('Account already exists!')
        if (userWithEmail) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(user => {
        delete user.password
        return res.json({ status: 'success', user })
      })
      .catch(err => next(err))
  }
}
module.exports = userController
