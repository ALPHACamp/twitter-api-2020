const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  signIn: (req, res) => {
    // 檢查必填欄位
    if (!req.body.email || !req.body.password) {
      return res.json({ status: 'error', message: '請輸入必填欄位' })
    }
    // 比對User資料庫、比對密碼
    let { email, password } = req.body
    // console.log('get email, password from jwt strategy: ', email, password)  // OK
    User.findOne({ where: { email } }).then(user => {
      if (!user) {
        return res.status(401).json({ status: 'error', message: '' })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: '' })
      }
      // issue token
      var payload = { id: user.id }
      var token = jwt.sign(payload, process.env.JWT_SECRET)
      // console.log('token = jwt.sign with', process.env.JWT_SECRET) // OK
      return res.json({
        status: 'success',
        message: 'OK',
        token: token,
        user: {
          id: user.id, name: user.name, account: user.account, email: user.email, role: user.role
        }
      })
    })
  },
  signUp: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body

    // 確認欄位是否皆有填寫
    if (!account || !name || !email || !password || !checkPassword) {
      return res.json({ status: 'error', message: '須田' })
    }
    // 確認密碼
    if (password !== checkPassword) {
      return res.json({ status: 'error', message: '' })
    }

    // 確認email或account是否重複
    User.findOne({
      where: {
        $or: [
          { email },
          { account }
        ]
      }
    }).then(user => {
      if (user) {
        if (user.email === email) {
          return res.json({ status: 'error', message: 'email已重覆註冊！' })
        }
        if (user.account === account) {
          return res.json({ status: 'error', message: 'account已重覆註冊！' })
        }
      } else {
        User.create({
          account, email, name,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
        })
        return res.json({ status: 'success', message: '成功註冊' })
      }
    })
  },
  getUserAccountSetting: (req, res) => {
    const userId = req.params.id
    return User.findByPk(userId)
      .then(user => {
        return res.json({
          user: {
            name: user.name,
            account: user.account,
            email: user.email
          }
        })
      })
  },
  putUserAccountSetting: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body

    // 確認欄位是否皆有填寫
    if (!account || !name || !email || !password || !checkPassword) {
      return res.json({ status: 'error', message: '須田' })
    }
    // 確認密碼
    if (password !== checkPassword) {
      return res.json({ status: 'error', message: '' })
    }

    // 確認email或account是否重複
    User.findOne({
      where: {
        $or: [
          { email },
          { account }
        ]
      }
    }).then(user => {
      if (user) {
        if (user.email === email) {
          return res.json({ status: 'error', message: 'email已重覆註冊！' })
        }
        if (user.account === account) {
          return res.json({ status: 'error', message: 'account已重覆註冊！' })
        }
      } else {
        return User.findByPk(req.params.id).then(user => {
          user.update({
            account, email, name,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
          })
          return res.json({ status: 'success', message: '成功編輯' })
        })
      }
    })
  },

  getCurrentUser: (req, res) => {
    return res.json({
      user: {
        id: userId,
        name: user.name,
        account: user.account,
        email: user.email
      }
    })
  }
}
module.exports = userController