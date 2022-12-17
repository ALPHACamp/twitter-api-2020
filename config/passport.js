const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
// const {getUser} = require('../_helpers')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
require('dotenv').config()

// set up Passport strategyisAuthenticated
passport.use('local', new LocalStrategy(
  // customize user field
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, account, password, cb) => {
    console.log('===========流程三')
    User.findOne({ where: { account } })
      .then(user => {
        if (!user) return cb(null, false, { message: '帳號或密碼輸入錯誤！' })
        bcrypt.compare(password, user.password)
          .then(res => {
            if (!res) return cb(null, false, { message: '帳號或密碼輸入錯誤！' })
            return cb(null, user)
          })
      })
  }
))

passport.use('localAdmin', new LocalStrategy(
	// customize user field
	{
		usernameField: 'account',
		passwordField: 'password',
		passReqToCallback: true
	},
	// authenticate user
	(req, account, password, cb) => {
		User.findOne({ where: { account } })
			.then(user => {
				if (!user) return cb(null, false, { message: 'account or password invalid!' })
				if (user.dataValues.role !== 'admin') return cb(null, false, { message: 'permission denied!' })
				bcrypt.compare(password, user.password)
					.then(res => {
						if (!res) return cb(null, false, { message: 'account or password invalid!' })
						return cb(null, user)
					})
			})
	}
))

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use('jwt', new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  User.findByPk(jwtPayload.id, { raw: true })
    .then(user => { cb(null, user) })
    .catch(err => cb(err))
}))

module.exports = passport
