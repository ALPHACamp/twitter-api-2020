const passport = require('passport')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const db = require('../models')
const User = db.User

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  User.findByPk(jwt_payload.id, {
    include: [{ model: User, as: 'Followers' }, { model: User, as: 'Followings' }]
  }).then(user => {
    if (!user) return next(null, false)
    user = {
      account: user.account,
      avatar: user.avatar,
      id: user.id,
      email: user.email,
      introduction: user.introduction,
      name: user.name,
      role: user.role,
      banner: user.banner,
      Followers: user.Followers.map(follower => follower.Followship.followerId),
      Followings: user.Followings.map(following => following.Followship.followingId)
    }
    return next(null, user)
  })
})
passport.use(strategy)

module.exports = passport