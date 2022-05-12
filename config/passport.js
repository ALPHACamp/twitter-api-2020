const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const { User, Tweet, Identity } = require('../models')

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  async (req, email, password, cb) => {
    const user = await User.findOne({ where: { email }, include: Identity })
    if (!user) return cb(null, false)
    const res = await bcrypt.compare(password, user.password)
    if (!res) return cb(null, false)
    return cb(null, user)
  }
))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser(async (id, cb) => {
  const user = await User.findByPk(id)
  console.log('passport.js test:', user)
  return cb(null, user)
})

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JwtStrategy(jwtOptions, async function (jwtPayload, cb) {
  try {
    const user = await User.findByPk(jwtPayload.id, {
      include: [
        { model: Tweet },
        { model: Identity },
        { model: User, as: 'Follower' },
        { model: User, as: 'Following' }
      ]
    })
    cb(null, user)
  } catch (err) {
    cb(err)
  }
}))

module.exports = passport
