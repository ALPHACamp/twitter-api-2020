const passport = require('passport')
const { User, Tweet} = require('../models')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

let strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
  const user = await User.findByPk(jwt_payload.id,{
    include: [
      { model: Tweet, as: 'RepliedTweets' },
      { model: Tweet, as: 'LikedTweets' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
  if (!user) return next(null, false)
  return next(null, user)

})
passport.use(strategy)


module.exports = passport