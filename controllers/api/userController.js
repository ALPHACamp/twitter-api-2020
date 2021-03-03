const db = require('../../models')
const User = db.User
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  getUser: (req, res) => {
    const { account, password } = req.body
    if (!account || !password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    User.findOne({ where: { account } }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'passwords did not match' })
      }
      var payload = { id: user.id }
      var token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token,
        user: {
          id: user.id, name: user.name, account: user.account, email: user.email, avatar: user.avatar, role: user.role
        }
      })
    })
  },
  signUp: (req, res) => {
    const { account, name, email, password, passwordCheck } = req.body
    if (!account || !password || !name || !email || !passwordCheck) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    User.findOne({ where: { email } }).then(user => {
      if (user) { return res.json({ status: 'error', message: "this email already exists " }) }
      if (password !== passwordCheck) {
        return res.json({ status: 'error', message: "password and passwordCheck didn't match" })
      }
      User.create({ account, name, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) })
        .then(() => res.json({ status: 'success', message: "signup successfully" }))
    })

  }
}

module.exports = userController