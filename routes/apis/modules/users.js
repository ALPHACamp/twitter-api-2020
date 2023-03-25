const express = require('express')
const { check } = require('express-validator')
const upload = require('../../../middleware/multer')

const router = express.Router()

const userController = require('../../../controllers/user-controller')

router.get('/:userId/tweets' , userController.getUserTweets)
router.get('/:userId/replied_tweets', userController.getUserReplies)
router.get('/:userId/likes', userController.getUserLikes)
router.get('/:userId/followers', userController.getUserFollowers)
router.get('/:userId/followings', userController.getUserFollowings)
router.get('/:userId', userController.getUser)
router.put('/:userId', upload.single('file'), userController.putUser)
router.patch('/:userId', userController.patchUser)

module.exports = router
