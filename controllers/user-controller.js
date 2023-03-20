const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const { User } = require('../models')
const { valueTrim } = require('../helpers/obj-helpers')

const userController = {
  signin: [
    passport.authenticate('local', {
      session: false
    }),
    (req, res, next) => {
      try {
        // 登入完後要發出jwt token
        const token = jwt.sign(helpers.getUser(req), process.env.JWT_SECRET, { expiresIn: '1d' }) // expiresIn: token的有效日期是一天
        res.json({
          token,
          user: helpers.getUser(req)
        })
      } catch (err) {
        next(err)
      }
    }
  ],
  signup: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = valueTrim(req.body)
      if (!account || !name || !email || !password || !checkPassword) throw new Error('所有欄位皆不可為空白')
      if (name.length > 50) throw new Error('名稱不可超過50字')
      if (password !== checkPassword) throw new Error('密碼與確認密碼不符')
      const [isAccountExist, isEmailExist] = await Promise.all([
        User.findOne({ where: { role: 'user', account }, attributes: ['id'] }),
        User.findOne({ where: { role: 'user', email }, attributes: ['id'] })
      ])
      if (isAccountExist) throw new Error('account 已重複註冊！')
      if (isEmailExist) throw new Error('email 已重複註冊！')
      const user = await User.create({
        role: 'user',
        account,
        name,
        email,
        password: bcrypt.hashSync(password, 10)
      })
      res.json(user)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
