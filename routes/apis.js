const helpers = require('../_helpers')
const homeController = require('../controllers/homeController')
const tweetController = require('../controllers/tweetController')
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const followshipController = require('../controllers/followshipController')
const router = require('express').Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

  // home 路由
router.post('/signin', homeController.postSignIn)

router.post('/users', homeController.postSignUp)

// tweet路由
router.get('/tweets', helpers.ensureAuthenticated, tweetController.allTweets)

router.get('/tweets/:id/top10', helpers.ensureAuthenticated, tweetController.getTop10Twitter)

router.get('/tweets/:id/replies', helpers.ensureAuthenticated, tweetController.getTweetReplies) //增加

router.get('/tweets/:id', helpers.ensureAuthenticated, tweetController.getTweet)

router.post('/tweets', helpers.ensureAuthenticated, tweetController.postTweet)

router.post('/tweets/:id/replies', helpers.ensureAuthenticated, tweetController.postTweetReply)

router.post('/tweets/:id/like', helpers.ensureAuthenticated, tweetController.postLike)

router.post('/tweets/:id/unlike', helpers.ensureAuthenticated, tweetController.postUnlike)

// user 路由
router.get('/users/chatRecords', helpers.ensureAuthenticated, userController.getChatRecords) //新增給私人聊天室紀錄

router.get('/users/:id/tweets', helpers.ensureAuthenticated, userController.getUserTweets)

router.get('/users/:id/replied_tweets', helpers.ensureAuthenticated, userController.getRepliedTweets)

router.get('/users/:id/likes', helpers.ensureAuthenticated, userController.getLikes)

router.get('/users/:id/followings', helpers.ensureAuthenticated, userController.getFollowings)

router.get('/users/:id/followers', helpers.ensureAuthenticated, userController.getFollowers)

router.get('/users/:id/userInfo', helpers.ensureAuthenticated, userController.getUserInfo)

router.get('/users/:id', helpers.ensureAuthenticated, userController.userPage)

router.put('/users/1', helpers.ensureAuthenticatedAdmin, userController.editUserData) //增加，測試檔測試userId=1 (root)
router.put('/users/:id', helpers.ensureAuthenticated, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.editUserData) //增加

router.post('/users/:id/subscribe', helpers.ensureAuthenticated, userController.subscribeUser)

  //followship路由
router.post('/followships', helpers.ensureAuthenticated, followshipController.follow) //路由要改

router.delete('/followships/:id', helpers.ensureAuthenticated, followshipController.unfollow)

  //  admin 路由
router.get('/admin', helpers.ensureAuthenticatedAdmin, adminController.getTweets)

router.get('/admin/users', helpers.ensureAuthenticatedAdmin, adminController.getUsers)

router.delete('/admin/tweets/:id', helpers.ensureAuthenticatedAdmin, adminController.deleteTweet)

module.exports = router
