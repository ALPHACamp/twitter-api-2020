const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const {
  User
} = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(new LocalStrategy({
  usernameField: 'account',
  passwordField: 'password',
  passReqToCallback: true
},
(req, account, password, cb) => {
  User.findOne({
    where: {
      account
    }
  })
    .then(user => {
      if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼錯誤！'))
      bcrypt.compare(password, user.password).then(res => {
        if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼錯誤！'))
        return cb(null, user)
      })
    })
}
))

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id, {
    include: [{
      model: User,
      as: 'Followers'
    },
    {
      model: User,
      as: 'Followings'
    }
    ]
  })
    .then(user => cb(null, user))
    .catch(err => cb(err))
}))

module.exports = passport
