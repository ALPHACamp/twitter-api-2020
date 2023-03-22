const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticated, authenticatedUser } = require('../../middleware/auth')
const upload = require('../../middleware/multer')

router.get('/:id/followers', userController.getUsersFollowings)
router.get('/:id/followings', userController.getUsersFollowings)
router.get('/:id/replied_tweets', authenticated, authenticatedUser, userController.getRepliedTweets)
router.get('/:id/likes', authenticated, authenticatedUser, userController.getLikeTweets)
router.get('/:id/tweets', authenticated, authenticatedUser, userController.getUserTweets)
router.get('/:id', authenticated, authenticatedUser, userController.getUser)
router.put('/:id', authenticated, authenticatedUser, upload.fields([
  { name: 'Avatar', maxCount: 1 },
  { name: 'Cover', maxCount: 1 }
]), userController.putUser)

module.exports = router
