const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

const { User, Tweet } = require('../models')

passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  async (req, account, password, done) => {
    try {
      const user = await User.findOne({ where: { account } })
      if (!user) return done(null, { error: { status: 'error', message: '帳號不存在' } })

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return done(null, { error: { status: 'error', message: '帳號或密碼錯誤' } })

      return done(null, user)
    } catch (error) {
      done(error, false)
    }
  }
))

// JWT strategy
const options = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(options, async (payload, done) => {
  try {
    let user = await User.findByPk(payload.id, {
      include: [
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
        { model: Tweet, as: 'LikedTweets' }
      ]
    })
    if (!user) return done(null, false)
    user = await user.toJSON()
    return done(null, user)
  } catch (error) {
    done(error, false)
  }
}))

module.exports = passport
