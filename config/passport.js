const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

// Strategies
passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  async (req, account, password, callbackFn) => {
    try {
      const user = await User.findOne({ where: { account } })
      if (!user) throw new Error('Account or Password error!')
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) throw new Error('Account or Password error!')
      return callbackFn(null, user)
    } catch (err) {
      callbackFn(err)
    }
  }
))
passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, callbackFn) => {
  try {
    const user = await User.findByPk(jwtPayload.id, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    return callbackFn(null, user)
  } catch (err) {
    callbackFn(err)
  }
}))
// Serialize and deserialize
passport.serializeUser((user, callbackFn) => {
  callbackFn(null, user.id)
})
passport.deserializeUser(async (id, callbackFn) => {
  try {
    const user = await User.findByPk(id, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    return callbackFn(null, user.toJSON())
  } catch (err) {
    callbackFn(err)
  }
})

module.exports = passport
