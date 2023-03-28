const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticatedUser } = require('../../middleware/auth')
const userController = require('../../controllers/user-controller')
const upload = require('../../middleware/multer')
router.post('/signin', passport.authenticate('user-local', { session: false }), userController.signIn)
router.post('/', userController.signUp)

router.use(authenticatedUser)
router.get('/top', authenticatedUser, userController.getTopUsers)
router.get('/:userId/likes', authenticatedUser, userController.getUserLikes)
router.get('/:userId/tweets', userController.getUserTweets)
router.get(
  '/:userId/replied_tweets', userController.getUserReplies)
router.get('/:userId/followings', userController.getUserFollowings)
router.get('/:userId/followers', userController.getUserFollowers)
router.put('/:userId', authenticatedUser, upload.single('image'), userController.editUserProfile)
router.get('/:userId', userController.getUser)

module.exports = router
