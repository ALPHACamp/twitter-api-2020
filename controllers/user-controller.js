const jwt = require('jsonwebtoken')
const { User } = require('../models')
const bcrypt = require('bcryptjs')

const userController = {
  signIn: (req, res, next) => {
    try {
      const user = req.user.toJSON()
      delete user.password
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '3d' })
      res.json({
        status: 'success',
        data: {
          token,
          user
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (!account || !name || !email || !password || !checkPassword) throw new Error('all fields are required')
      if (password !== checkPassword) throw new Error('password and checkPassword not matched')
      const [userAccount, userEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      if (userAccount) throw new Error('the account has already been used by someone else')
      if (userEmail) throw new Error('the email has already been registered by someone else')
      const userCreate = await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, 10)
      })
      const user = userCreate.toJSON()
      delete user.password
      res.json({
        status: 'success',
        data: { user }
      })
    } catch (err) {
      next(err)
    }
  },
  getSetting: async (req, res, next) => {
    try {
      if (Number(req.params.id) !== req.user.id) return res.status(403).json({ status: 'error', message: 'permission denied' })
      const user = await User.findByPk(req.params.id, { raw: true })
      if (!user) throw new Error('user not exist')
      delete user.password
      res.json({
        status: 'success',
        data: { user }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController