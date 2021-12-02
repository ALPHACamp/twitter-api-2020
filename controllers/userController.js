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
      return res.json({ status: 'error', message: '請輸入必填欄位'})
    }
    // 比對User資料庫、比對密碼
    let { email, password } = req.body
    // console.log('get email, password from jwt strategy: ', email, password)  // OK
    User.findOne({ where: { email }}).then(user => {
      if (!user) {
        return res.status(401).json({ status: 'error', message: ''})
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: '' })
      }
      // issue token
      var payload = { id: user.id}
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
  }
}

module.exports = userController