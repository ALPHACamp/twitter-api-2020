const { User } = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const userController = {
  register: async (req, res, next) => {
    try {
      if (req.body.password !== req.body.passwordCheck) throw new Error('密碼與確認密碼不符。')

      if (await User.findOne({ where: { account: req.body.account } })) throw new Error('此帳號已經註冊。')

      const user = await User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        role: req.body.role === 'admin' ? 'admin' : 'user'
      })
      res.json({ status: 'success', user })
    } catch (err) {
      next(err)
    }
  },
  login: async (req, res, next) => {
    try {
      const userData = req.user.toJSON()
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
      next(err)
    }
  }
}
module.exports = userController
