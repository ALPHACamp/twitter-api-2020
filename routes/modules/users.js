const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
// const { authenticated } = require('../../middleware/auth')
const upload = require('../../middleware/multer')

router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id/replied_tweets', userController.getRepliedTweets)
router.get('/:id/likes', userController.getLikes)
router.get('/:id/followings', userController.getUserFollowings)
router.get('/:id/followers', userController.getUserFollowers)
router.put('/:id/settings', userController.putUserSettings)
router.get('/top', userController.getTopUsers)
router.get('/current_user', userController.getCurrentUser)
router.get('/:id', userController.getUser)
router.put('/:id', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.putUser)

// 前台註冊
router.post('/', userController.signUp)

module.exports = router
