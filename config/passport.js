const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const bcrypt = require('bcryptjs')
const { User } = require('../models')

// LocalStrategy Setting
passport.use(new LocalStrategy(
  { usernameField: 'account', passwordField: 'password', passReqToCallback: true },
  async (req, account, password, cb) => {
    try {
      const errorMessage = '帳號或密碼輸入錯誤！'
      const user = await User.findOne({ where: { account } })

      // 帳號或密碼輸入錯誤 暫時的錯誤處理
      if (!user) {
        return cb(errorMessage, false, { message: errorMessage })
      }
      const isMatch = await bcrypt.compare(password, user.password)

      // 帳號或密碼輸入錯誤 暫時的錯誤處理
      if (!isMatch) {
        console.log('帳號或密碼輸入錯誤！')
        return cb(errorMessage, false, { message: errorMessage })
      }
      return cb(null, user)
    } catch (error) {
      cb(error)
    }
  }
))

// JWTStrategy Setting
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'secret'
}

passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
  try {
    const errorMessage = 'unAuthenticated'
    const user = await User.findByPk(jwtPayload.id
      , {
        // include: [
        // // join table Like
        //   { model: Tweet, as: 'LikedUsers' },
        //   { model: User, as: 'LikedTweets' },
        //   // join table Reply
        //   { model: Tweet, as: 'RepliedUsers' },
        //   { model: User, as: 'RepliedTweets' },
        //   // join table FollowShip
        //   { model: User, as: 'Followers' },
        //   { model: User, as: 'Followings' }
        // ]
      }
    )
    if (!user) return cb(errorMessage, false, { message: errorMessage })
    return cb(null, user)
  } catch (error) {
    cb(error)
  }
}))

// passport serializeUser & deserializeUser
passport.serializeUser((user, cb) => cb(null, user.id))

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findByPk(id)
    return cb(null, user.toJSON())
  } catch (error) {
    cb(error)
  }
})

module.exports = passport
