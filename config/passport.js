const passport = require('passport')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const { User, Tweet } = require('../models')

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
passport.use(new JWTStrategy(jwtOptions, async(jwtPayload, cb) => {
  try{
    const user = await User.findByPk(jwtPayload.id)
    cb(null, user)
  }catch(err){
    cb(err)
  }
}))


module.exports = passport