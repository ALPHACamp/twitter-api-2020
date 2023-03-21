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
        if (!user) return cb(null, false)

        const isMatched = await bcrypt.compare(password, user.password)
        if (!isMatched) return cb(null, false)

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
