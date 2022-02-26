const passport = require('passport')
const passportJWT = require('passport-jwt')
const { Followship } = require('../models')


const { User } = require('../models')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  console.log('hiiiiii', jwtPayload)
  return User.findByPk(jwtPayload.id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => {
      if (!user) cb(null, false)
      return cb(null, user.toJSON())
    })
    .catch(err => cb(err))
}))

exports = module.exports = passport
