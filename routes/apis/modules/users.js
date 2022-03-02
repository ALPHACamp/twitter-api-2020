const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = require('../../../middleware/multer')
const multiFilesUpload = upload
  .fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ])

const userController = require('../../../controllers/user-controller')


router.get('/top', userController.getTopUsers)
router.get('/:id/tweets', userController.getTweets)
router.put('/:id/setting', userController.putUserSetting)
router.get('/:id/followers', userController.getFollowers)
router.get('/:id/followings', userController.getFollowings)
router.get('/:id/likes', userController.getLikes)
router.get('/:id/replied_tweets', userController.getReplies)
router.get('/:id', userController.getUser)
router.put('/:id', multiFilesUpload, userController.putUser)


exports = module.exports = router