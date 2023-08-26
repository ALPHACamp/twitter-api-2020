const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')
const upload = require('../../middleware/multer')

router.get('/top', userController.getTopUser)

router.get('/:id/tweets', userController.getUserTweets)

router.get('/:id/replied_tweets', userController.getUserReplies)

router.get('/:id/likes', userController.getUserLikes)

router.get('/:id/followings', userController.getFollowings)

router.get('/:id/followers', userController.getFollowers)

router.get('/:id', userController.getUser)

router.put('/:id', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), userController.putUser)

module.exports = router
