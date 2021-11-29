if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        return done(null, false, { message: '帳號或密碼輸入錯誤' })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: '帳號或密碼輸入錯誤' })
      }
      return done(null, user)
    })
}))

passport.serializeUser((user, done) => {
  return done(null, user.id)
})
passport.deserializeUser((id, done) => {
  User.findByPk(id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => {
      user = user.toJSON()
      return done(null, user)
    })
    .catch(err => done(err, null))
})

//jwt
const passportJwt = require('passport-jwt')
const ExtractJwt = passportJwt.ExtractJwt
const JwtStrategy = passportJwt.Strategy

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET
passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
  User.findByPk(jwt_payload.id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  }).then(user => {
    if (!user) {
      return done(null, false)
    }
    return done(null, user)
  })
}));

module.exports = passport