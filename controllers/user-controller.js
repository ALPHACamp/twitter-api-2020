const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const { User } = require('../models')
const helpers = require('../_helpers')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      switch (true) {
        case (req.originalUrl === '/api/users/signin' && userData.role !== 'user'):
          res.status(403).json({
            status: 'error',
            message: 'Permission denied.'
          })
          break
        case (req.originalUrl === '/api/admin/signin' && userData.role !== 'admin'):
          res.status(403).json({
            status: 'error',
            message: 'Permission denied.'
          })
          break
        default: {
          const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '15d' })
          return res.json({
            status: 'success', token, user: userData
          })
        }
      }
    } catch (err) {
      next(err)
    }
  },

  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      // check required fields
      if (!account?.trim() || !name?.trim() || !email?.trim() || !password?.trim() || !checkPassword?.trim()) throw new Error('All the fields are required.')
      // check password
      if (password !== checkPassword) throw new Error('The password confirmation does not match.')
      // check email format
      if (!validator.isEmail(email)) throw new Error('Email address is invalid.')
      // check length of name
      if (name?.length > 50) throw new Error('Name must be less than 50 characters long.')
      // check account and email existence
      const [userAccount, userEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      if (userAccount) throw new Error('Account already exists.')
      if (userEmail) throw new Error('Email already exists.')

      const user = await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, 10)
      })
      return res.json({
        id: user.id,
        account: user.account
      })
    } catch (err) {
      next(err)
    }
  },

  getCurrentUser: (req, res, next) => {
    try {
      const { id, email, account, name, avatar, role } = helpers.getUser(req)
      return res.json({ id, email, account, name, avatar, role })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController
