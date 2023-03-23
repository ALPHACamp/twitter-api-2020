const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const upload = require('../../middleware/multer')

router.get('/:id/followers', userController.getUsersFollowings)
router.get('/:id/followings', userController.getUsersFollowers)
router.get('/:id/replied_tweets', userController.getRepliedTweets)
router.get('/:id/likes', userController.getLikeTweets)
router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id', userController.getUser)
router.put('/:id', upload.fields([
  { name: 'Avatar', maxCount: 1 },
  { name: 'Cover', maxCount: 1 }
]), userController.putUser)

module.exports = router
