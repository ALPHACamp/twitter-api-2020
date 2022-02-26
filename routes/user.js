const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const { authenticated, authenticatedUser } = require('../middleware/api-auth')
const upload = require('../middleware/multer')

router.post('/', userController.signUp)

router.use(authenticated, authenticatedUser)

router.put('/account/setting', userController.putSetting)
router.get('/:id/replied_tweets', userController.getUserReplies)
router.get('/:id/likes', userController.getUserLikes)
router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id/followings', userController.getUserFollowings)
router.get('/:id/followers', userController.getUserFollowers)
router.get('/top', userController.getTopUsers)
router.put('/:id', upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]), userController.putUser)
router.get('/:id', userController.getUser)

module.exports = router