const { User } = require('../models')
const { getUser } = require('../helpers/auth-helpers.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// 之後加'../helpers/file-helpers'

const userController = {
  register: async (req, res, next) => {
    try {
      const { name, account, email, password, checkPassword } = req.body
      if (!name || !account || !email || !password || !checkPassword) throw new Error('所有欄位皆為必填!')
      if (name.length > 50) throw new Error()
      const userEmail = await User.findOne({ where: { email } })
      const userAccount = await User.findOne({ where: { account } })
      if (userEmail) throw new Error('email 已重複註冊！')
      if (userAccount) throw new Error('account 已重複註冊！')
      const hash = await bcrypt.hash(password, 10)
      let newUser = await User.create({
        name,
        account,
        email,
        password: hash,
        role: 'user'
      })
      newUser = newUser.toJson
      delete newUser.password
      return res.json({
        status: 'success',
        message: '註冊成功',
        data: { newUser }
      })
    } catch (err) {
      next(err)
    }
  },
  login: (req, res, next) => {
    try {
      const userData = getUser(req)?.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      if (userData.role === 'admin') throw new Error('帳號不存在!')
      return res.json({
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
