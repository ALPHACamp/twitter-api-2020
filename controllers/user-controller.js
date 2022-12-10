const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        status: 'success',
        token,
        user: userData
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    try {
      const {
        email,
        name,
        account,
        password
      } = req.body

      // 確認email or account是否已存在
      const message = {}
      const [userEmail, userAccount] = await Promise.all([
        User.findOne({ where: { email } }),
        User.findOne({ where: { account } })
      ])

      if (userEmail) message.email = 'email 已重複註冊！'
      if (userAccount) message.account = 'account已重複註冊!'
      if (Object.keys(message).length !== 0) {
        return res.status(422).json({
          status: 'error',
          message,
          email,
          account,
          name
        })
      }

      // 建立user資料
      const newUser = await User.create({
        email,
        account,
        password: bcrypt.hashSync(password, 10),
        name
      })

      // 回傳新增使用者資料，刪除password欄位
      const userData = newUser.toJSON()
      delete userData.password

      res.json({
        status: 'success',
        user: userData
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
