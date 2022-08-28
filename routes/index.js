const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const followshipController = require('../controllers/followshipController')
const tweetController = require('../controllers/tweetController')
const notifyController = require('../controllers/notifyController')
const roomController = require('../controllers/roomController')

const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    next()
  } else {
    return res.status(401).json({ status: 'error', message: '沒有 Admin 權限' })
  }
}

// 跑測試檔，替代authenticate
// 正式跑專案時無法使用，因為 helpers return 的 res.user的資訊 是由測試檔提供，正式專案下的 user的資訊 是透過驗證 token 後，JWT 給出的 jwt_payload.id 去資料庫撈出對應的 user資訊，此時 helpers return 的應該是 undefined
// const helpers = require('../_helpers')
// const authenticated = (req, res, next) => {
//   if (helpers.getUser(req)) {
//     const user = helpers.getUser(req)
//     req.user = {
//       ...req.user,
//       ...user
//     }
//     // req.body.email = 'User1'
//     // req.body.account = 'User1'
//     return next()
//   }
//   return res.status(401).json({ status: 'error' })
// }

const multer = require('multer')
const upload = multer()

module.exports = (app) => {
  app.get('/api/get_current_user', authenticated, userController.getCurrentUser)

  app.post('/api/users/signin', userController.signIn)
  app.post('/api/users', userController.signUp)
  app.put('/api/users/setting', authenticated, userController.putSetting)
  app.put('/api/users/:id', authenticated, upload.array('files', 2), userController.putUser)
  app.get('/api/users/:id/tweets', authenticated, userController.getUserTweets)
  app.get('/api/users/:id/replied_tweets', authenticated, userController.getUserRepliedTweets)
  app.get('/api/users/:id/likes', authenticated, userController.getUserLikes)
  app.get('/api/users/:id/followings', authenticated, userController.getUserFollowings)
  app.get('/api/users/:id/followers', authenticated, userController.getUserFollowers)
  app.get('/api/users/:id', authenticated, userController.getUser)

  app.get('/api/rooms/getConnectedUsers', authenticated, roomController.getConnectedUsers)
  app.post('/api/rooms/createChatRoom', authenticated, roomController.createChatRoom)
  app.put('/api/rooms/updateUserUnreadNum', authenticated, roomController.updateUserUnreadNum)

  app.get('/api/followships/recommended', authenticated, followshipController.getRecommendedFollowings)
  app.post('/api/followships', authenticated, followshipController.postFollowship)
  app.delete('/api/followships/:id', authenticated, followshipController.deleteFollowship)

  app.post('/api/notify', authenticated, notifyController.postNoti)
  app.delete('/api/notify/:id', authenticated, notifyController.deleteNoti)

  app.get('/api/tweets', authenticated, tweetController.getTweets)
  app.post('/api/tweets', authenticated, tweetController.postTweet)
  app.post('/api/tweets/:id/like', authenticated, tweetController.likeTweet)
  app.post('/api/tweets/:id/unlike', authenticated, tweetController.unlikeTweet)
  app.get('/api/tweets/:id/replies', authenticated, tweetController.getTweetReplies)
  app.post('/api/tweets/:id/replies', authenticated, tweetController.postTweetReply)
  app.get('/api/tweets/:id', authenticated, tweetController.getTweet)

  app.post('/api/admin/users/signin', adminController.signIn)
  app.get('/api/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
  app.get('/api/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
  app.delete('/api/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)
  app.get('/api/admin/recountUserTweetsRepliesLikesNum', authenticated, authenticatedAdmin, adminController.recountUserTweetsRepliesLikesNum)
  app.get('/api/admin/recountUserFollowersNum', authenticated, authenticatedAdmin, adminController.recountUserFollowersNum)
}
