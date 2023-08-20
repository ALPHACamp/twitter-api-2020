const passport = require('passport')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const { User } = require('../models')

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // 告訴我token在哪裡
  secretOrKey: process.env.JWT_SECRET // 使用密鑰來檢查 token 是否經過纂改
}
passport.use(new JWTStrategy(jwtOptions, async(jwtPayload, cb) => {
  try{
    const user = await User.findByPk(jwtOptions.id)
    cb(null, user)
  }catch(err){
    cb(err)
  }
}))


module.exports = passport