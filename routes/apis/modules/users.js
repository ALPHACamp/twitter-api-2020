const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/apis/user-controller')
const upload = require('../../../middleware/multer')
const picUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])

router.get('/top', userController.getTopUsers)
router.get('/:userId/followings', userController.getFollowingsOfUser)
router.get('/:userId/replied_tweets', userController.getRepliesOfUser)
router.get('/:userId/followers', userController.getFollowersOfUser)
router.get('/:userId/likes', userController.getLikesOfUser)
router.get('/:userId/tweets', userController.getTweetsOfUser)
router.put('/:userId/profile', userController.editSettingofUser)
router.put('/:userId', picUpload, userController.editUser)
router.get('/:userId', userController.getUser)

module.exports = router
