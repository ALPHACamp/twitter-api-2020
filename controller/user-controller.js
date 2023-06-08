const bcrypt = require('bcryptjs')
const { User } = require('../models')
const jwt = require('jsonwebtoken')
const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })// 簽證效期30天
      res.json({ status: 'success', data: { token, user: req.user } })
    } catch (err) { next(err) }
  },
  signUp: async (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match')
    try {
      // check if user with given email or account already exists
      const existingAccount = await User.findOne({ where: { account: req.body.account } })
      const existingEmail = await User.findOne({ where: { email: req.body.email } })
      if (existingAccount) { throw new Error('Account already exists!') }
      if (existingEmail) { throw new Error('Email already exists!') }
      // If user does not exist, hash password and create new user
      const hash = await bcrypt.hash(req.body.password, 10)
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        account: req.body.account,
        role: 'user'
      })
      const userJSON = newUser.toJSON()
      delete userJSON.password
      return res.json({ status: 'success', data: { user: userJSON } })
    } catch (err) { next(err) }
  }
}

module.exports = userController
