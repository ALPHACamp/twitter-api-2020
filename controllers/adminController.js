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
  signIn: (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.json({ ststus: 'error', message: '請輸入 email 與密碼' })
    }

    User.findOne({ where: { email: email } })
      .then(user => {
        if (!user || user.role === 'user') {
          return res.status(401).json({ status: 'error', message: '不存在此 admin 管理者' })
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ ststus: 'error', message: '密碼錯誤' })
        }

        //簽發 token
        let payload = { id: user.id }
        let token = jwt.sign(payload, process.env.JWT_SECRET)
        return res.json({
          status: 'success',
          message: '登入驗證成功',
          token: token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            account: user.account,
            avatat: user.avatat,
            introduction: user.introduction,
            role: user.role
          }
        })
      })
  },
  getUsers: (req, res) => {
    User.findAll({ raw: true, nest: true })
      .then(users => {
        return res.json(users)
      })
  },
  deleteTweet: (req, res) => {
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        tweet.destroy()
          .then(() => {
            return res.json({ status: 'success', message: '' })
          })
      })
  }
}

module.exports = adminController
