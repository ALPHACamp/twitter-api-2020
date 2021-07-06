const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

passport.use(new LocalStrategy({
  usernameField: 'account',
  passportField: 'password',
  passReqToCallback: true
}, (req, username, password, cb) => {
  User.findOne({ where: { account: username } })
    .then(user => {
      if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
      if (!bcrypt.compareSync(password !== user.password)) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
    })
}
))
passport.serializeUser((user, cb) => cb(null, user.id))
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [{ model: User, as: 'Followings' }, { model: User, as: 'Followers' }, { model: Tweet, as: 'LikedTweets' }]
  })
})


//JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const JwtStrategy = passportJWT.Strategy
const ExtractJwt = passportJWT.ExtractJwt
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_SECRET
let jwtStrategy = new JwtStrategy(opts, function (jwt_payload, next) {
  User.findByPk(jwt_payload.id, {
    include: [{ model: User, as: 'Followings' }, { model: User, as: 'Followers' }, { model: Tweet, as: 'LikedTweets' }]
  }).then(user => {
    if (!user) return next(null, false)
    return next(null, user)
  })
})

passport.use('jwt', jwtStrategy)
module.exports = passport