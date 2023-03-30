const passport = require('passport')
const bcrypt = require('bcryptjs')
const createError = require('http-errors')
const { Strategy: LocalStrategy } = require('passport-local')
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt')
const { User } = require('../models')
const sequelize = require('sequelize')

passport.use(new LocalStrategy({
  usernameField: 'account'
}, async (account, password, done) => {
  try {
    const user = await User.findOne({
      where: sequelize.where(sequelize.fn('BINARY', sequelize.col('account')), account)
    })
    if (!user) throw createError(404, '帳號不存在')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw createError(401, '帳號或密碼錯誤')

    done(null, user.toJSON())
  } catch (error) {
    done(error)
  }
}))

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
  try {
    const user = await User.findByPk(jwtPayload.id, {
      attributes: ['id', 'name', 'account', 'email', 'role']
    })

    done(null, user.toJSON())
  } catch (error) {
    done(error)
  }
}))

module.exports = passport
