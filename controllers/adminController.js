const db = require('../models')
const User = db.User
const Tweet = db.Tweet

const bcrypt = require('bcryptjs')

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const adminController = {
  // 後台登入
  adminLogIn: async (req, res, next) => {
    try {
      const { email, password } = req.body
      // 檢查是否輸入帳號密碼
      if (!email || !password) {
        return res.json({
          status: 'error',
          message: 'All fields are required.',
        })
      }
      // 確認使用者資料
      const user = await User.findOne({ where: { email } })
      // 檢查前台登入權限
      if (user.role === 'user') {
        return res.status(401).json({
          status: 'error',
          message: 'User can only login to frontend.',
        })
      }
      // 無此使用者
      if (!user) {
        return res
          .status(401)
          .json({ status: 'error', message: 'User does not exist.' })
      }
      // 檢查密碼是否正確
      if (!bcrypt.compareSync(password, user.password)) {
        return res
          .status(401)
          .json({ status: 'error', message: 'Incorrect password.' })
      }

      // 簽發 token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'Login successful.',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          account: user.account,
          introduction: user.introduction,
          role: user.role,
        },
      })
    } catch (err) {
      next(err)
    }
  },
  // 後台：刪除單一 tweet
  deleteTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      tweet.destroy()
      return res
        .status(200)
        .json({
          status: 'success',
          message: `Tweet id: ${tweet.id} is deleted. `,
        })
    } catch (err) {
      next(err)
    }
  },
}

module.exports = adminController
