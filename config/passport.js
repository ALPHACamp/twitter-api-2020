const db = require('../models')
const passport = require('passport')
const { User, Tweet} = require('../models')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  User.findByPk(jwt_payload.id).then(user => {
    console.log(user)
    if (!user) return next(null, false)
    return next(null, user)
  })
})
passport.use(strategy)


module.exports = passport