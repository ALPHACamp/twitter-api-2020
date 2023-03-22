const express = require('express')
const router = express.Router()
const { apiErrorHandler } = require('../../middleware/error-handler')
const userController = require('../../controllers/user-controller')
const upload = require('../../middleware/multer')

router.post('/test-token', userController.userVerify)
router.get('/tweets', userController.getUserTweets)
router.get('/:id/tweets', userController.getTweets)
router.get('/:id/replied_tweets', userController.getReplies)
router.get('/:id/likes', userController.getLikes)
router.get('/:id/followings', userController.getFollowings)
router.get('/:id/followers', userController.getFollowers)
router.get('/:id', userController.getUser)
router.put(
  '/:id',
  upload.fields([{ name: 'avatar' }, { name: 'background' }]),
  userController.putUser
)
module.exports = router
