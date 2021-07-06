const { User } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminController = {
  signIn: async (req, res, next) => {
    try {
      const { email, password } = req.body
      // 檢查必填資料
      if (!email || !password) {
        return res.json({ status: 'error', message: 'Email跟密碼皆為必填！' })
      }
      // 檢查 user 是否存在和密碼是否正確
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.json({ status: 'error', message: '找不到此Email。' })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.json({ status: 'error', message: '帳號或密碼不正確！' })
      }
      // 檢查是否為非管理者
      if (!user.isAdmin) {
        return res.json({ status: 'error', message: '非管理者無法登入後台！' })
      }
      // 簽發 token
      const payload = { id: user.id }
      const token = jwt.sign(payload, 'SimpleTwitterSecret')
      return res.json({
        status: 'success',
        message: '登入成功！',
        token: token,
        user: {
          // 這包user回傳資料可依前端需求增減
          id: user.id, account: user.account, name: user.name, email: user.email, isAdmin: user.isAdmin, avatar: user.avatar
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
