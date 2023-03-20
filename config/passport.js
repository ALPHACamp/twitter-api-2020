const passport = require('passport')
const passportJWT = require('passport-jwt')
const { User } = require('../models')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id) // 看到時候需要什麼資料，直接在這裡改
    .then(user => cb(null, user))
    .catch(err => cb(err))
}))

module.exports = passport
