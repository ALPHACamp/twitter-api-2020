const passport = require('passport')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const userController = require('../controllers/userController')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

let strategy = new JwtStrategy(jwtOptions, async (jwr_payload, next) => {
  try {
    User.findByPk(jwr_payload.id, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ],
    })

    if (!user) {
      return next(null, false)
    }
    return next(null, user)
  } catch {
    return next(err, false)
  }
})

passport.use(strategy)

module.exports = passport
