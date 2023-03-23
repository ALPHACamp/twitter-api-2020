const passport = require('passport')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const db = require('../models')
const User = db.User
const Like = db.Like

const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET || 'secret'

const strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  User.findByPk(jwt_payload.id, {
    include: [{ model: User, as: 'Followers' }, { model: User, as: 'Followings' }, Like, { model: User, as: 'NotiObjs' }]
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
      // 將 follower、following、like、notiObj 的 id 存到新陣列中，在前端可以比對畫面上每個 follower、following、like、notiObj 是否與 currentUser 有互動關聯，已決定顯示介面，例如 跟隨/正在跟隨、like/unlike...等。
      Followers: user.Followers.map(follower => follower.Followship.followerId),
      Followings: user.Followings.map(following => following.Followship.followingId),
      userLikesId: user.Likes.map(like => like.TweetId),
      NotiObjs: user.NotiObjs.map(notiObj => notiObj.Notify.notiObj)
    }
    return next(null, user)
  })
})
passport.use(strategy)

module.exports = passport
