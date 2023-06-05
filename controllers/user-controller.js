const { User } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const { newErrorGenerate } = require('../helpers/newError-helper')

const userController = {
  // 使用者註冊
  signup: async (req, res, next) => {
    try {
      const { name, account, email, password, checkPassword } = req.body
      if (!name || !account || !email || !password || !checkPassword) newErrorGenerate('所有欄位皆為必填!', 404)
      if (name.length > 50) newErrorGenerate('暱稱字數超出上限!', 404)
      if (password !== checkPassword) newErrorGenerate('密碼及確認密碼不相符!', 404)
      const userAccount = await User.findOne({ where: { account } })
      const userEmail = await User.findOne({ where: { email } })
      if (userAccount) newErrorGenerate('account 已重複註冊！', 404)
      if (userEmail) newErrorGenerate('email 已重複註冊！', 404)
      const hash = await bcrypt.hash(password, 10)
      let user = await User.create({
        name,
        account,
        email,
        password: hash,
        role: '普通會員'
      })
      user = user.toJSON()
      delete user.password
      return res.json({ status: 'success', data: { user } })
    } catch (err) {
      next(err)
    }
  },
  // 前台登入
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      if (userData.role === '管理員') newErrorGenerate('帳號不存在！', 404)
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
  }
}
module.exports = userController
