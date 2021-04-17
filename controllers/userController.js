const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  login: async (req, res) => {
    // Make sure all the fields are filled out
    if (!req.body.account || !req.body.password) {
      return res.json({
        status: 'error',
        message: 'All fields are required.'
      })
    }

    // Check email and password
    const account = req.body.account
    const password = req.body.password

    const user = await User.findOne({ where: { account } })

    if (!user) {
      return res
        .status(401)
        .json({ status: 'error', message: 'That email is not registered.' })
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res
        .status(401)
        .json({ status: 'error', message: 'Incorrect Password' })
    }

    // Sign token
    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET)
    return res.json({
      status: 'success',
      message: 'ok',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  },
  register: async (req, res) => {
    const { account, name, email, password, checkPassword } = req.body

    try {
      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(10),
          null
        )
      })

      return res.json({
        status: 'success',
        message: `${req.body.email} register successfully! Please login.`
      })
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = userController
