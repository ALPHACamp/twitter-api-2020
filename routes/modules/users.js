const express = require('express')
const router = express.Router()

const upload = require('../../middleware/multer')
const userController = require('../../controllers/user-controller')

router.put('/:id', upload.fields([{ name: 'avatar' }, { name: 'cover' }]), userController.editUser)
router.get('/top10', userController.getUserTop10)
router.get('/:id/likes', userController.getUserLikes)
router.get('/:id/replied_tweets', userController.gerUserReplies)
router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id/followings', userController.getUsersFollowings)
router.get('/:id/followers', userController.getUsersFollowers)
router.get('/:id', userController.getUser)

module.exports = router
