const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// 先這樣，之後有要再加 model
const { User, Like } = require('../models')

// set up Local Passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // 把 req pass 給 callback (下面那個)
  },
  // authenticate user
  // 這個就是上面提到的 callback
  (req, email, password, cb) => { // cb 則是這函式準備的 callback Fn.，就是官方文件的 .done()，傳驗證的結果
    User.findOne({ where: { email } })
      .then(user => {
        // (下1) 舊的
        // if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        // (上1) cb 的三個引數, 1. 是否有錯(沒錯放 null) 2. 使用者資訊(有的話就放 user) 3. 若有錯誤，可在這擺額外資訊
        // (下1) 土法煉鋼，老實講，我覺得有更漂亮寫法，若要研究，首先得理解 cb 到底傳到哪...
        if (!user) throw new Error('帳號不存在！')
        bcrypt.compare(password, user.password)
          .then(res => {
          // if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
          // '帳號或密碼輸入錯誤！' --> 訊息刻意一樣，增加攻擊難度
          // (下1) 老實講，我野覺得這不大好，之後再想有沒有更漂亮寫法
            if (!res) throw new Error('帳號或密碼輸入錯誤！')
            return cb(null, user)
          // 3-S8-178 若用 JWT (session: false)，req.user 的材料會從這回傳 (未被 .toJSON())
          })
          .catch(err => cb(err, false)) // 這目的明明就是把 error 丟去 error-handler，我卻不知詳細機制，得再複習
      })
      .catch(err => cb(err, false))
  }
))

const jwtOptions = {
  // jwtFromRequest -> 從哪找到這 token
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  // (上1) 設定去哪裡找 token，這裡指定了 authorization header 裡的 bearer 項目。
  secretOrKey: process.env.JWT_SECRET // 定義 secret
}
passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id, {
    // 先註記，之後依這個改
    include: [
    //   { model: Restaurant, as: 'FavoritedRestaurants' },
    //   { model: Restaurant, as: 'LikeRestaurants' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
      { model: Like }
    ]
  })
    .then(user => cb(null, user))
    .catch(err => cb(err))
}))

module.exports = passport
