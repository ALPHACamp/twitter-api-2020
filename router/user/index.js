const router = require('express').Router()
const userController = require('../../controllers/user/userController')
const multer = require('multer')
const upload = multer()

// user
router.get('/:id', userController.getUser)
router.put(
  '/:id',
  upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'avatar', maxCount: 1 }
  ]),
  userController.putUser
)

router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id/replied_tweets', userController.getUserRepliedTweet)
router.get('/:id/likes', userController.getUserLiked)
router.get('/:id/followings', userController.getUserFollowings)
router.get('/:id/followers', userController.getUserFollowers)
module.exports = router
