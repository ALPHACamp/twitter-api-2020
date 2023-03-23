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
  User.findByPk(jwtPayload.id, {
    attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } // 這是會回傳給req.user的當前使用者資料，不需要取太多
  })
    .then(user => cb(null, user))
    .catch(err => cb(err))
}))

module.exports = passport
