const passport = require('passport')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const db = require('../models')
const User = db.User

let jwtOptions = {} //用來存放登陸驗證所需的資訊
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.TOKEN_SECRET

passport.use(new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
  try {
    const user = await User.findByPk(jwt_payload.id)
    if (!user) {
      return done(null, false)
    }
    return done(null, user)
  } catch (err) {
    console.warn(err)
  }
}))

module.exports = passport