const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userController = {
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
      // check user role, must be admin
      if (user.role !== 'user') {
        return res.status(401).json({ status: 'error', message: 'you don\'t have authority to login!' })
      }
      // check password correct or not
      if (!bcrypt.compareSync(password, user.password)) {
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
  // 註冊
  register: async (req, res) => {
    try {
      const { account, name, email, password, confirmPassword } = req.body
      // check account & name & email & password & confirmPassword are required
      if (!account || !name || !email || !password || !confirmPassword) {
        return res.json({ status: 'error', message: 'account, name, email, password, confirmPassword are required!' })
      }
      // check password & confirmPassword are same
      if (password !== confirmPassword) {
        return res.json({ status: 'error', message: 'password & confirmPassword must be same!' })
      }
      // check email & account have not been used
      const userEmail = await User.findOne({ where: { email } })
      if (userEmail) return res.json({ status: 'error', message: 'this email has been used!' })
      const userAccount = await User.findOne({ where: { account } })
      if (userAccount) return res.json({ status: 'error', message: 'this account has been used!' })
      // create user
      await User.create({ account, name, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null), role: 'user' })
      return res.json({ status: 'success', message: 'register success!' })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = userController
