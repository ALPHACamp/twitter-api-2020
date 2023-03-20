const { User } = require('../models')
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const { getUser } = require('../_helpers')
const userController = {
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (!email || !name || !account || !password || !checkPassword) throw new Error('請填寫所有欄位!')
      if (password !== checkPassword) throw new Error('密碼與確認密碼不一致!')// 確認密碼一致
      const user = await User.findOne({ // account 和 email 不能與其他人重複
        where: {
          [Op.or]: [
            { email },
            { account }
          ]
        }
      })
      if (user) {
        if (user.email === email) throw new Error('email 已重複註冊！')
        if (user.account === account) throw new Error('account 已重複註冊')
      }
      const hash = await bcrypt.hash(password, 10)
      const createdUser = await User.create({
        account,
        name,
        email,
        password: hash
      })
      res.json({ status: 'success', user: createdUser })
    } catch (error) {
      next(error)
    }
  },
  signIn: (req, res, next) => {
    try {
      const userData = getUser(req).toJSON()
      delete userData.password
      if (userData.role === 'admin') return res.json({ status: 'error', message: '帳號不存在！' })
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
  },
  signInFail: (error, req, res, next) => {
    return res.status(401).send({ status: 'error', error, reason: req.session.messages })
  },
  userVerify: (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    res.json({ status: 'success', user: decoded })
  }
}
module.exports = userController
