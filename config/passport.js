const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')

const { User, Tweet, Reply, Like } = require('../models')
const bcrypt = require('bcryptjs')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// set up Passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },

  (req, account, password, cb) => {
    // 查詢是否資料有輸入的email資料
    User.findOne({ where: { account } })
      .then(user => {
        // 若沒有使用者資料，回傳錯誤
        if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤!'))

        // 若有使用者資料，使用bcrypt比對是否與資料庫密碼一致
        bcrypt.compare(password, user.password)
          .then(res => {
            // 若不一致，回傳錯誤
            if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤!'))

            // 回傳user
            return cb(null, user)
          })
      })
  }
))

// 宣告物件，有token的authorization header 裡的 bearer 資訊，與所設定的金鑰
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true
}

// 設定jwt的登入策略
// 帶入jwtOptions，解開 token並回傳jwt裡的payload資料
passport.use(new JWTStrategy(jwtOptions, (req, jwtPayload, cb) => {
  // 使用payload的id資料尋找user資料，並關連其他model
  User.findByPk(jwtPayload.id, {
    include: [
      { model: Tweet },
      { model: Like, include: Tweet },
      { model: Reply, include: Tweet },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => {
      req.currentUser = user
      cb(null, user)
    }) // 回傳user資料
    .catch(err => cb(err))
}))



module.exports = passport