const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const { authenticated, authenticatedRole } = require('../../middlewares/auth')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// Sign in or Sign up
router.post('/signin', userController.signIn)
router.post('/', userController.postUser)

// Edit user's profile or account setting
router.put(
  '/:id',
  authenticated,
  authenticatedRole(),
  upload.fields([
    { name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }
  ]),
  userController.putUser
)

// Get current user or top 10 recommend users
router.get('/current_user', authenticated, userController.getCurrentUser)
router.get('/top', authenticated, authenticatedRole(), userController.getTopUsers)

// Get certain user's tweets or replied tweets
router.get('/:id/tweets', authenticated, authenticatedRole(), userController.getUserTweets)
router.get('/:id/replied_tweets', authenticated, authenticatedRole(), userController.getUserRepliedTweets)

// Get certain user's data, liked content, followings or followers
router.get('/:id/likes', authenticated, authenticatedRole(), userController.getUserLikedTweets)
router.get('/:id/followings', authenticated, authenticatedRole(), userController.getUserFollowings)
router.get('/:id/followers', authenticated, authenticatedRole(), userController.getUserFollowers)
router.get('/:id', authenticated, authenticatedRole(), userController.getUser)

module.exports = router
