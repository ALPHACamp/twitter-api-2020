const passport = require('passport')
const { User, Tweet } = require('../models')

// JWT Authentication
const passportJWT = require('passport-jwt')
const LocalStrategy = require('passport-local')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

passport.use(
  new LocalStrategy(
    {
      usernameField: 'account',
      passwordField: 'password',
    },
    (account, password, done) => {
      User.findOne({ where: { account } })
        .then((user) => {
          if (!user) throw new Error("帳號不存在！")
          if (!bcrypt.compareSync(password, user.password))
            throw new Error('帳號或密碼錯誤！')
          return done(null, user)
        })
        .catch((err) => done(err, false))
    }
  )
)

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JwtStrategy(jwtOptions, (jwt_payload, cb) => {
  User.findByPk(jwt_payload.id, {
    include: [
      { model: Tweet, as: 'LikedTweets' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
  .then(user => cb(null, user))
    .catch(err => cb(err))
}))

module.exports = passport
