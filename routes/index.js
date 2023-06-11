const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const tweetController = require('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')
const followshipController = require('../controllers/followship-controller')

// const cors = require('../middleware/cors')
const upload = require('../middleware/multer')

const { authenticatedAdmin, authenticatedUser, authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

// signup & signin
router.post('/api/admin/signin', adminController.signIn)
router.post('/api/users/signin', userController.signIn)
router.post('/api/users', userController.signUp)

// user
router.put('/api/users/:id', authenticated, authenticatedUser, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), userController.putUser)
router.get('/api/users/:id/tweets', authenticated, authenticatedUser, userController.getUserTweets)
router.get('/api/users/:id/replied_tweets', authenticated, authenticatedUser, userController.getUserRepliedTweets)
router.get('/api/users/:id/likes', authenticated, authenticatedUser, userController.getUserLikedTweets)
router.get('/api/users/:id/followings', authenticated, authenticatedUser, userController.getUserFollowings)
router.get('/api/users/:id/followers', authenticated, authenticatedUser, userController.getUserFollowers)
router.get('/api/users/:id', authenticated, authenticatedUser, userController.getUser)

// tweet
router.get('/api/tweets/:id', authenticated, authenticatedUser, tweetController.getTweet)
router.get('/api/tweets', authenticated, authenticatedUser, tweetController.getTweets)
router.post('/api/tweets', authenticated, authenticatedUser, tweetController.postTweets)

// like
router.post('/api/tweets/:id/like', authenticated, authenticatedUser, tweetController.addLike)
router.post('/api/tweets/:id/unlike', authenticated, authenticatedUser, tweetController.removeLike)


// followship
router.post('/api/followships', authenticated, authenticatedUser, followshipController.addFollowing)
router.delete('/api/followships/:id', authenticated, authenticatedUser, followshipController.removeFollowing)





// admin
router.delete('/api/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.delTweet)

router.get('/api/admin/tweets', authenticated, authenticatedUser, tweetController.getTweets)

// reply
router.post('/api/tweets/:id/replies', authenticated, authenticatedUser, replyController.postReplies)
router.get('/api/tweets/:id/replies', authenticated, authenticatedUser, replyController.getReplies)



router.use('/', generalErrorHandler)

module.exports = router