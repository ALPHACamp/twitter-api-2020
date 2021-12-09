const passport = require('passport')
const db = require('../models')
const User = db.User

// JWT
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

// setup JWT

const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

const strategy = new JwtStrategy(jwtOptions, function (jwtPayload, next) {
  User.findByPk(jwtPayload.id, { include: [{ model: db.Like }, { model: User, as: 'Followers' }, { model: User, as: 'Followings' }] }).then((user) => {
    user = user.toJSON()
    if (!user) return next(null, false)
    return next(null, user)
  })
})
passport.use(strategy)

module.exports = passport
