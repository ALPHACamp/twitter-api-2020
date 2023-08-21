const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const ExtractJWT = passportJWT.ExtractJwt
const JWTStrategy = passportJWT.Strategy

// local strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password'
  },
  async (account, password, done) => {
    try {
      const user = await User.findOne({ where: { account } })
      if (!user) throw new Error('User does not exist!')

      const result = await bcrypt.compare(password, user.password)
      if (!result) throw new Error('Incorrect account or password!')

      return done(null, user)
    } catch (err) {
      return done(err)
    }
  }
))

// jwt strategy
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
  try {
    const user = await User.findByPk(jwtPayload.id)
    if (!user) return done(null, false)

    return done(null, user)
  } catch (error) {
    return done(error)
  }
})
)

module.exports = passport
