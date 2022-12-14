<<<<<<< HEAD
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      // 初始化message物件
      const message = {}
      // 確認密碼與確認密碼是否一致
      if (password !== checkPassword) message.password = '密碼與確認密碼不符'

      // 查詢資料庫帳號與信箱是否已註冊
      const [userAccount, userEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])

      if (userAccount) message.account = '帳號已註冊!'
      if (userEmail) message.email = '信箱已註冊!'

      // 若有任一錯誤，接回傳錯誤訊息及原填載資料
      if (Object.keys(message).length !== 0) {
        return res.status(422).json({
          status: 'error',
          message,
          account,
          name,
          email
        })
      }

      // 建立新使用者
      const newUser = await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      })

      // 回傳新使用者資料，刪除password欄位
      const userData = newUser.toJSON()
      delete userData.password
      return res.json({
        status: 'success',
        user: userData
=======
const jwt = require('jsonwebtoken')
const userController = {
  signIn: (req, res, next) => {
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
>>>>>>> 36f7ae15f623236c04eedbf7e1d48d0d35256d54
      })
    } catch (err) {
      next(err)
    }
  }
}
<<<<<<< HEAD

=======
>>>>>>> 36f7ae15f623236c04eedbf7e1d48d0d35256d54
module.exports = userController
