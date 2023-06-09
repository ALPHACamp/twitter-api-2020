const { User } = require('../models')
const { getUser } = require('../helpers/auth-helpers.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const { imgurFileHandler } = require('../../helpers/file-helpers.js')

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
      let userData = await User.create({
        account,
        email,
        password: hash,
        name,
        avatar: 'https://i.imgur.com/NUfWDow.png',
        cover: 'https://i.imgur.com/ApSQQYH.png',
        introduction: 'Hello there!',
        role: 'user'
      })
      userData = userData.toJSON()
      return res.json({
        status: 'success',
        message: '註冊成功',
        data: { user: userData }
      })
    } catch (err) {
      next(err)
    }
  },
  login: async (req, res, next) => {
    try {
      const userData = await getUser(req)?.toJSON()
      delete userData.password
      const token = await jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
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
