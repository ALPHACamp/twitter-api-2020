const passport = require('passport')
const passportJWT = require('passport-jwt')
const { User, Tweet, Reply, Like } = require('../models')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// 宣告物件，token的 bearer 資訊，與所設定的金鑰
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'test',
}

// 設定jwt的登入策略
passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  // 使用payload的id資料尋找user資料，並關連其他model
  User.findByPk(jwtPayload.id, {
    include: [
      Like,
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => {
      cb(null, user)
    }) // 回傳user資料
    .catch(err => cb(err))
}))


module.exports = passport