const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

router.get('/top', userController.getTopUsers)
router.get('/setting', userController.getUserSetting)
router.get('/:id/tweets', userController.getTweets)
router.get('/:id/replied_tweets', userController.getRepliedTweets)
router.get('/:id/likes', userController.getLikes)
router.get('/:id/followings', userController.getFollowings)
router.get('/:id/followers', userController.getFollowers)
router.get('/:id', userController.getUser)

router.put('/setting', userController.putUserSetting)
router.put('/:id', upload.fields([{ name: 'avatar' }, { name: 'cover_image' }]), userController.putUser)

module.exports = router
