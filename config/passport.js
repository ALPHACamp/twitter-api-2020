const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const bcrypt = require('bcryptjs')
const { User } = require('../models')

//  set up Passport Strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'account',
    passwordField: 'password'
  },
  //  authenticate user
  async (account, password, callback) => {
    try {
      //  account error
      const user = await User.findOne({ where: { account } })
      if (!user) {
        const err = new Error('帳號或密碼錯誤!')
        err.status = 401
        throw err
      }
      // password error
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        const err = new Error('帳號或密碼錯誤!')
        err.status = 401
        throw err
      }
      // no error
      return callback(null, user)
    } catch (err) {
      return callback(err, false)
    }
  }
))

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true
}

passport.use(new JWTStrategy(jwtOptions, async (req, jwtPayload, callback) => {
  try {
    const user = await User.findByPk(jwtPayload.id, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    })
    req.user = user
    callback(null, user)
  } catch (err) {
    callback(err)
  }
}))

module.exports = passport
