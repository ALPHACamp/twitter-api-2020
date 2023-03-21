const passport = require('passport')
const bcrypt = require('bcryptjs')
const createError = require('http-errors')
const { Strategy: LocalStrategy } = require('passport-local')
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt')
const { User } = require('../models')

passport.use(new LocalStrategy({
  usernameField: 'account'
}, (account, password, done) => {
  return User.findOne({ where: { account } })
    .then(user => {
      if (!user) throw createError(404, '帳號不存在')

      return bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) throw createError(401, '帳號或密碼錯誤')

          return done(null, user.toJSON())
        })
        .catch(error => done(error))
    })
    .catch(error => done(error))
}))

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(jwtOptions, (jwtPayload, done) => {
  return User.findByPk(jwtPayload.id, {
    attributes: ['id', 'name', 'account', 'email', 'role']
  })
    .then(user => done(null, user))
    .catch(error => done(error))
}))

module.exports = passport
