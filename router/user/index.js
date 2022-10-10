const router = require('express').Router()
const userController = require('../../controllers/user/userController')
const multer = require('multer')
const upload = multer()
const { authenticated } = require('../../middleware/auth')
// user
router.post('/', userController.signUp)
router.get('/:id', authenticated, userController.getUser)
router.put(
  '/:id',
  authenticated,
  upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'avatar', maxCount: 1 }
  ]),
  userController.putUser
)

router.get('/:id/tweets', authenticated, userController.getUserTweets)
router.get(
  '/:id/replied_tweets',
  authenticated,
  userController.getUserRepliedTweet
)
router.get('/:id/likes', authenticated, userController.getUserLiked)
router.get('/:id/followings', authenticated, userController.getUserFollowings)
router.get('/:id/followers', authenticated, userController.getUserFollowers)
module.exports = router
