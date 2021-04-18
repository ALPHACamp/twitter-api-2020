const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')

// JWT
const jwt = require('jsonwebtoken')
// const passportJWT = require('passport-jwt')
// const ExtractJwt = passportJWT.ExtractJwt
// const JwtStrategy = passportJWT.Strategy

const adminController = {
  // 登入
  login: async (req, res) => {
    try {
      const { email, password } = req.body
      // check email & password required
      if (!email || !password) {
        return res.json({ status: 'error', message: 'email and password are required!' })
      }
      // check email & password exist
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'this email has not been registered!' })
      }
      // check password correct or not
      // if (bcrypt.compareSync(password, user.password)) {
      //   return res.status(401).json({ status: 'error', message: 'password incorrect!' })
      // }
      if (password !== user.password) {
        return res.status(401).json({ status: 'error', message: 'password incorrect!' })
      }
      // get token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      })
    } catch (e) {
      console.log(e)
    }
  },
  // 取得所有使用者資料
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        raw: true,
        nest: true
      })
      if (users.length === 0) {
        return res.json({ message: 'db has no user!' })
      }
      console.log('users', users)
      return res.json(users)
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = adminController
