const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

const userController = require('../../controllers/user-controller')

const { authenticatedUser } = require('../../middleware/auth')

const upload = require('../../middleware/multer')
const imageUpload = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
])

router.post('/signin', passport.authenticate('user-local', { session: false }), userController.signIn)
router.post('/', userController.signUp)

router.use(authenticatedUser)

router.get('/:userId/likes', userController.getUserLikes)
router.get('/:userId/tweets', userController.getUserTweets)
router.get(
  '/:userId/replied_tweets', userController.getUserReplies)
router.get('/:userId/followings', userController.getUserFollowings)
router.get('/:userId/followers', userController.getUserFollowers)
router.put('/:userId/account', userController.editUserAccount)
router.get('/top', userController.getTopUsers)
router.put('/:userId', imageUpload, userController.editUserProfile)
router.get('/:userId', userController.getUser)

module.exports = router
