const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const { User } = require('../models')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, cb) => {
      try {
        const user = await User.findOne({ where: { email } })
        if (!user) throw new Error('帳號不存在！')

        const isMatched = await bcrypt.compare(password, user.password)
        if (!isMatched) throw new Error('帳號或密碼輸入錯誤！')

        return cb(null, user)
      } catch (err) {
        return cb(err, null)
      }
    }
  )
)

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}
passport.use(
  new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
    try {
      const user = await User.findByPk(jwtPayload.id, {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
        ],
      })
      return cb(null, user)
    } catch (err) {
      return cb(err, null)
    }
  })
)

module.exports = passport
