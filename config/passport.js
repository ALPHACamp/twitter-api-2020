const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const bcrypt = require('bcryptjs')

const { User } = require('../models')

// set up local Passport strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({
      where: { email } // user checking by email
      // include: [
      //   { model: Tweet, as: 'Tweets', order: [['createdAt', 'DESC']] }
      // ]
    })
    if (!user) {
      return done(null, false, { message: '使用者不存在', status: 401 });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: '信箱或是密碼錯誤', status: 401 });
    }
    return done(null, user.get());
  } catch (err) {
    return done(err, false);
  }
}))

// middleware for jwt
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

// jwtStrategy
passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id, { //拿payload裡面的id
  })
    .then(user => {
      if (!user) return cb(null, false)
      return cb(null, user)
    })
    .catch(err => cb(err))
})
)

// for local: serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  return User.findByPk(id, { // 使以下可透過req.user查詢
  })
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})

module.exports = passport
