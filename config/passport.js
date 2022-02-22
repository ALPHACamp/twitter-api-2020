const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const { User } = require('../models')


passport.use(new LocalStrategy({
  usernameField: 'account',
  passwordField: 'password'
}, async (account, password, cb) => {
  try {
    const user = await User.findOne({ where: { account } })
    // if user is not found, then return false
    if (!user) return cb(null, false)

    const isMatched = await bcrypt.compare(password, user.password)
    // if password is not matched, then return false
    if (!isMatched) return cb(null, false)

    // if both account and password checks all passed
    // then return user
    return cb(null, user)

  } catch (err) { return cb(err, false) }
}))

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
  try {
    const user = await User.findByPk(jwtPayload.id, {
      include: [
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    })

    return cb(null, user)
    
  } catch (err) { cb(err, false) }
}))


module.exports = passport