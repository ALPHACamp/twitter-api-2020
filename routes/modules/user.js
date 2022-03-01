const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticated } = require('../../middleware/auth')
const upload = require('../../middleware/multer')
const uploadConfig = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
])



router.get('/self', authenticated, userController.getSelfUser)
router.get('/top', authenticated, userController.getTopUsers)
router.post('/', userController.signup)
router.get('/:UserId', authenticated, userController.getUser)
router.put('/:UserId', authenticated, uploadConfig, userController.putUser)
router.get('/:UserId/likes', authenticated, userController.getLikedTweets)
router.get('/:UserId/replied_tweets', authenticated, userController.getRepliedTweets)
router.get('/:UserId/followings', authenticated, userController.getFollowings)
router.get('/:UserId/followers', authenticated, userController.getFollowers)
router.get('/:UserId/tweets', authenticated, userController.getTweetsOfUser)


module.exports = router