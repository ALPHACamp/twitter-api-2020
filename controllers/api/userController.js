/* necessary package */
const bcrypt = require('bcryptjs')
/* DB */
const db = require('../../models')
const { User } = db

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  signIn: (req, res) => {
    const { email, password } = req.body
    // 檢查必要資料
    if (!email || !password) {
      return res.json({
        status: 'error',
        message: 'Please fill both Email & Password fields!'
      })
    }
    // 檢查 user 是否存在與密碼是否正確
    User.findOne({ where: { email } }).then((user) => {
      if (!user)
        return res
          .status(401)
          .json({ status: 'error', message: 'Email do NOT exist!' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res
          .status(401)
          .json({ status: 'error', message: 'Passwords is incorrect!' })
      }
      if (user.role === 'admin') {
        return res.status(401).json({
          status: 'error',
          message: 'Admin can only access backend!'
        })
      }
      const { id, name, email, account, introduction, role } = user
      // 簽發 token
      var payload = { id }
      var token = jwt.sign(payload, 'alphacamp')
      return res.json({
        status: 'success',
        message: 'Login successfully!',
        token,
        user: {
          id,
          name,
          email,
          account,
          introduction,
          role
        }
      })
    })
  },

  signUp: (req, res) => {
    const { name, account, email, password, checkPassword } = req.body
    if (checkPassword !== password) {
      return res.json({ status: 'error', message: 'Passwords is not matched!' })
    } else {
      User.findOne({ where: { account } }).then((user) => {
        if (user) {
          return res.status(401).json({
            status: 'error',
            message: 'Account has already existed!'
          })
        } else {
          User.findOne({ where: { email } })
            .then((user) => {
              if (user) {
                return res.status(401).json({
                  status: 'error',
                  message: 'Email has already existed!'
                })
              } else {
                User.create({
                  account,
                  name,
                  email,
                  password: bcrypt.hashSync(
                    password,
                    bcrypt.genSaltSync(10),
                    null
                  ),
                  role: 'user'
                })
              }
            })
            .then((user) => {
              return res.status(200).json({
                status: 'success',
                message: 'Successfully register!'
              })
            })
        }
      })
    }
  }
}

module.exports = userController
