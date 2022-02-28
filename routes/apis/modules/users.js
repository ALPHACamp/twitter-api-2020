const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = require('../../../middleware/multer')
const multiFilesUpload = upload
  .fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ])

// 使用者控制器按照分工而分為userController和tempController，避免衝突
const userController = require('../../../controllers/user-controller')
const tempController = require('../../../controllers/temp-controller')

router.get('/top', userController.getTopUsers)
router.get('/:id/tweets', userController.getTweets)
router.put('/:id/setting', userController.putUserSetting)
router.get('/:id/followers', tempController.getFollowers)
router.get('/:id/followings', tempController.getFollowings)
router.get('/:id/likes', tempController.getLikes)
router.get('/:id/replied_tweets', tempController.getReplies)
router.get('/:id', userController.getUser)
router.put('/:id', multiFilesUpload, userController.putUser)


exports = module.exports = router