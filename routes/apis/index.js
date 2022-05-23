const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const userController = require('../../controllers/apis/user-controllers')
const tweetController = require('../../controllers/apis/tweet-controller')
const likeController = require('../../controllers/apis/like-controller')
const replyController = require('../../controllers/apis/reply-controller')
const followshipController = require('../../controllers/apis/followship-controller')
const adminController = require('../../controllers/apis/admin-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const upload = require('../../middleware/multer')
const {
  authenticated,
  authenticatedAdmin
} = require('../../middleware/api-auth')

router.post(
  '/signin',
  passport.authenticate('local', { session: false, failWithError: true }),
  userController.signIn
)
router.get('/current_user', authenticated, userController.getCurrentUser)
router.get('/users/top', authenticated, userController.getTopUser)

router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/replied_tweets', authenticated, userController.getUserReplies)
router.get('/users/:id/likes', authenticated, userController.getUserLikes)
router.get('/users/:id/followings', authenticated, userController.getUserFollowings)
router.get('/users/:id/followers', authenticated, userController.getUserFollowers)

router.put('/users/:id', authenticated, upload.fields([
  { name: 'avatar_img', maxCount: 1 },
  { name: 'cover_img', maxCount: 1 }
]), userController.editUser)
router.get('/users/:id', authenticated, userController.getUser)
router.post('/users', userController.signUp)

router.delete('/followships/:fId', authenticated, followshipController.deleteFollowship)
router.post('/followships', authenticated, followshipController.postFollowship)

router.get('/tweets/:tId/replies', authenticated, replyController.getReply)
router.post('/tweets/:tId/replies', authenticated, replyController.postReply)

router.post('/tweets/:tId/like', authenticated, likeController.postLike)
router.post('/tweets/:tId/unlike', authenticated, likeController.postUnlike)

router.get('/tweets/:tId', authenticated, tweetController.getTweet)
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)

router.delete(
  '/admin/tweets/:id',
  authenticated,
  authenticatedAdmin,
  adminController.deleteTweet
)
router.get(
  '/admin/users',
  authenticated,
  authenticatedAdmin,
  adminController.getUsers
)

router.use('/', apiErrorHandler)

module.exports = router
