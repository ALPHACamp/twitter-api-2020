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
    const { email, password } = req.body
    if (!email || !password) {
      return res.json({
        status: 'error',
        message: "required fields didn't exist",
      })
    }

    User.findOne({ where: { email } }).then((user) => {
      if (!user)
        return res
          .status(401)
          .json({ status: 'error', message: 'no such user found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res
          .status(401)
          .json({ status: 'error', message: 'passwords did not match' })
      }
      // 簽發 token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id,
          role: user.role,
        },
      })
    })
  },
  getUser: async (req, res) => {
    try {
      const user = (await User.findByPk(req.params.id)).toJSON()
      return res.json({
        ...user
      })
    } catch (error) {
      console.log(error)
    }
  },
}

module.exports = userController
