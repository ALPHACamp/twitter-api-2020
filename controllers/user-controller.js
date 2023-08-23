const bcrypt = require('bcryptjs') // 載入 bcrypt
const jwt = require('jsonwebtoken')
const { User } = require('../models')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc') // 引入 UTC 套件
const timezone = require('dayjs/plugin/timezone') // 引入時區套件

dayjs.extend(utc) // 使用 UTC 套件
dayjs.extend(timezone) // 使用時區套件

const userController = {
  signUp: (req, res, next) => {
    // 如果二次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.confirmPassword) throw new Error('二次輸入密碼不符合!')
    // 檢查name字數，上限為50字
    if (req.body.name.length > 50) throw new Error('字數超出上限！')
    // 查找是否有該帳戶或email
    Promise.all([
      User.findOne({ where: { account: req.body.account } }),
      User.findOne({ where: { email: req.body.email } })
    ])
      .then(([account, email]) => {
        // 如果有一樣的account或email，丟錯告知前端
        if (account) throw new Error('account 已重複註冊！')
        if (email) throw new Error('email 已重複註冊！')
        // 如果檢查ok，呼叫bcrypt將使用者的密碼進行雜湊
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => {
        return User.create({
          email: req.body.email,
          password: hash,
          name: req.body.name,
          account: req.body.account
        })
      })
      .then(user => {
        res.status(200).json({
          status: 'success',
          message: `${req.body.account}已經成功註冊!`,
          user: {
            id: user.id,
            email: user.email,
            account: user.account,
            name: user.name,
            updatedAt: dayjs(user.updatedAt).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss'),
            createdAt: dayjs(user.createdAt).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss')
          }
        })
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password // 刪除密碼
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.status(200).json({
        status: 'success',
        message: `${userData.account}已經成功登入!`,
        data: {
          token,
          user: {
            ...userData,
            updatedAt: dayjs(userData.updatedAt).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss'),
            createdAt: dayjs(userData.createdAt).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss')
          }
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
