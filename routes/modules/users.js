const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticated } = require('../../middleware/auth')
const upload = require('../../middleware/multer')

router.get('/:id/tweets', authenticated, userController.getUserTweets)
router.get('/:id/replied_tweets', authenticated, userController.getRepliedTweets)
router.get('/:id/likes', authenticated, userController.getLikes)
router.get('/:id/followings', authenticated, userController.getUserFollowings)
router.get('/:id/followers', authenticated, userController.getUserFollowers)
router.put('/:id/settings', authenticated, userController.putUserSettings)
router.get('/top', authenticated, userController.getTopUsers)
router.get('/current_user', authenticated, userController.getCurrentUser)
router.get('/:id', authenticated, userController.getUser)
router.put('/:id', authenticated,
  upload.fields([{ name: 'avatar' }, { name: 'cover' }]), userController.putUser)

// 前台註冊
router.post('/', userController.signUp)

module.exports = router
