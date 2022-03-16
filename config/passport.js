const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const { User, Tweet } = require('../models')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(
  new LocalStrategy(
    {
      usernameField: 'account',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, account, password, cb) => {
      User.findOne({ where: { account } }).then(user => {
        if (!user)
          return cb(
            null,
            false,
            req.flash('error_messages', '帳號或密碼輸入錯誤')
          )
        if (!bcrypt.compareSync(password, user.password))
          return cb(null, false, req.flash('error_messages', '密碼輸入錯誤！'))
        return cb(null, user)
      })
    }
  )
)

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET || 'test'

passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
  try {
    const user = await User.findByPk(jwtPayload.id)
    if (!user) {
      return done(null, false)
    }
    return done(null, user)
  } catch (err) {
    console.warn(err)
  }
}))



passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [

    ]
  }).then(user => {
    user = user.toJSON()
    return cb(null, user)
  })
})

module.exports = passport