const db = require('../models')
const { User } = db
const bcrypt = require('bcryptjs')

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const adminController = {
  signIn: async (req, res) => {
    try {
      const { account, password } = req.body
      if (!account || !password) {
        return res.json({ status: 'error', message: '所有欄位都是必填' })
      }
      const admin = await User.findOne({ where: { account } })
      if (!admin) return res.status(401).json({ status: 'error', message: '管理員帳號或密碼有誤' })
      if (admin.role !== 'admin') return res.status(401).json({ status: 'error', message: '無權限登入' })
      if (!bcrypt.compareSync(password, admin.password)) {
        return res.status(401).json({ status: 'error', message: '管理員帳號或密碼有誤' })
      }
      const payload = { id: admin.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: admin.id,
          account: admin.account,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = adminController
