const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const sequelize = require('sequelize')
// set up passport local strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'account',
    passwordField: 'password'
  },
  // authenticate user
  (account, password, cb) => {
    User.findOne({
      where: { account },
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT (*) FROM Tweets WHERE Tweets.user_id = User.id )'), 'tweetCount']
        ]
      }
    })
      .then(user => {
        if (!user) return cb(Error('帳號不存在'), false)
        bcrypt.compare(password, user.password).then(res => {
          if (!res) return cb(Error('密碼輸入錯誤'), false)
          return cb(null, user)
        })
      })
      .catch(err => cb(err))
  }
))
// set up passport JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id)
    .then(user => cb(null, user))
    .catch(err => cb(err))
}))

module.exports = passport
