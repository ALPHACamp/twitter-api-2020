const passport = require('passport')
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const { User } = require('../models')

// JWT Authentication
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

let strategy = new JWTStrategy(jwtOptions, async (jwtPayLoad, done) => {
  try {
    const user = await User.findByPk(jwtPayLoad.id, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })

    return done(null, user)
  } catch (error) {
    done(error)
  }
})

passport.use(strategy)

module.exports = passport
