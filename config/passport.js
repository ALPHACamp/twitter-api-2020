const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User, /* Reply, Tweet, */ Like } = require('../models')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
// set up Passport strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password'
  },

  async (account, password, cb) => {
    try {
      const user = await User.findOne({ where: { account } })
      if (!user) throw new Error('帳號不存在!')
      const res = await bcrypt.compare(password, user.password)
      if (!res) throw new Error('帳號或密碼錯誤！')
      return cb(null, user)
    } catch (err) {
      cb(err)
    }
  }
))

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true
}

passport.use(new JWTStrategy(jwtOptions, async (req, jwtPayload, cb) => {
  try {
    const user = await User.findByPk(jwtPayload.id, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      include: [
        /* Reply, Tweet, */ Like,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    return cb(null, user.toJSON())
  } catch (err) {
    return cb(err, false)
  }
}))

module.exports = passport
