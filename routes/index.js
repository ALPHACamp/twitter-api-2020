const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const followshipController = require('../controllers/followshipController')
const tweetController = require('../controllers/tweetController')

const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })

// 測試用，上傳圖片到 imgur，尚未完成
const multer = require('multer')
let upload = multer()
const { ImgurClient } = require('imgur');
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

module.exports = (app) => {
  app.get('/api/get_current_user', authenticated, userController.getCurrentUser)

  app.post('/api/users/signin', userController.signIn)
  app.post('/api/users', userController.signUp)
  app.put('/api/users/:id', authenticated, userController.putUser)
  app.get('/api/users/:id/tweets', authenticated, userController.getUserTweets)
  app.get('/api/users/:id/replied_tweets', authenticated, userController.getUserRepliedTweets)
  app.get('/api/users/:id/likes', authenticated, userController.getUserLikes)
  app.get('/api/users/:id/followings', authenticated, userController.getUserFollowings)
  app.get('/api/users/:id/followers', authenticated, userController.getUserFollowers)
  app.get('/api/users/:id', authenticated, userController.getUser)

  app.get('/api/followships/recommended', authenticated, followshipController.getRecommendedFollowings)
  app.post('/api/followships', authenticated, followshipController.postFollowship)
  app.delete('/api/followships/:id', authenticated, followshipController.deleteFollowship)

  app.get('/api/tweets', authenticated, authenticated, tweetController.getTweets)
  app.post('/api/tweets', authenticated, tweetController.postTweet)
  app.post('/api/tweets/:id/like', authenticated, tweetController.likeTweet)
  app.post('/api/tweets/:id/unlike', authenticated, tweetController.unlikeTweet)
  app.get('/api/tweets/:id/replies', authenticated, tweetController.getTweetReplies)
  app.post('/api/tweets/:id/replies', authenticated, tweetController.postTweetReply)
  app.get('/api/tweets/:id', authenticated, tweetController.getTweet)

  app.post('/api/admin/users/signin', adminController.signIn)
  app.get('/api/admin/users', adminController.getUsers)
  app.get('/api/admin/tweets', adminController.getTweet)
  app.delete('/api/admin/tweets/:id', adminController.deleteTweet)

  // 測試用，上傳圖片到 imgur，尚未完成。目前用 postman 傳 OK
  app.post('/api/test', upload.single('userNewBanner'), async (req, res) => {
    try {
      console.log('===')
      console.log('===')
      console.log('===')
      console.log('req.body', typeof req.body, req.body)
      console.log('req.file', req.file)

      const encode_image = req.file.buffer.toString('base64')
      const client = new ImgurClient({ clientId: IMGUR_CLIENT_ID });
      const response = await client.upload({
        image: encode_image,
        type: 'base64',
      })
      if (response.status === 200) {
        return res.json({ status: 'success', link: response.data.link })
      } else {
        return res.json({ status: 'error', message: '上傳失敗' })
      }
    } catch (error) {
      console.warn(error)
    }
  })
}