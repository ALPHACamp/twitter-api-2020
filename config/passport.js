const { User } = require('../models')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
// const bcrypt = require('bcryptjs')

passport.use(new LocalStrategy({
  usernameField: 'account',
  passwordField: 'password'
}, async (account, password, cb) => {
  try {
    const user = await User.findOne({ where: { account } })
    if (!user) throw new Error('帳號或密碼錯誤！')
    // const isMatch = await bcrypt.compare(password, user.passport)
    const isMatch = password === user.password
    if (!isMatch) throw new Error('帳號或密碼錯誤！')
    return cb(null, user)
  } catch (err) {
    return cb(err, false)
  }
}))

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(jwtOptions, async (payload, cb) => {
  try {
    const user = await User.findByPk(payload.id, {
      include: [
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    })

    return cb(null, user)
  } catch (err) {
    cb(err, false)
  }
}))

module.exports = passport
