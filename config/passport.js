const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User, Tweet } = require('../models')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
// set up Passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'account',
    passwordField: 'password'
  },
  // authenticate user
  async (account, password, cb) => {
    const user = await User.findOne({ where: { account } })
    if (!user) return cb(null, false, { message: 'Incorrect' })
    const isChecked = await bcrypt.compare(password, user.password) 
    if (!isChecked) return cb(null, false, { message: 'Incorrect'})
    return cb(null, user)
  }))

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
  const user = await User.findByPk(jwtPayload.id, {
    include: [
      { model: Tweet, as: 'RepliedTweets' },
      { model: Tweet, as: 'LikedTweets' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
  if (!user) return cb(null, false)
  return cb(null, user)
}))


module.exports = passport