// user routes
const express = require('express')
const router = express.Router()
const { multiUpload } = require('../../middleware/multer')
// import controller
const userController = require('../../controllers/user-controller')
// import auth
const {
  authenticated,
  authenticatedUser
} = require('../../middleware/api-auth')

// user login
router.post('/signin', userController.signIn)
router.post('/', userController.signUp)

// user profile
router.put('/:id/setting', authenticated, authenticatedUser, userController.putUser)
router.get('/:id', authenticated, authenticatedUser, userController.getUserProfile)
router.put('/:id', authenticated, authenticatedUser, multiUpload, userController.putUserProfile)

// user data
router.get('/:id/tweets', authenticated, authenticatedUser, userController.getUserTweets)
router.get('/:id/replied_tweets', authenticated, authenticatedUser, userController.getUserRepliedTweets)
router.get('/:id/likes', authenticated, authenticatedUser, userController.getUserLikes)
router.get('/:id/followings', authenticated, authenticatedUser, userController.getFollowings)
router.get('/:id/followers', authenticated, authenticatedUser, userController.getFollowers)

module.exports = router
