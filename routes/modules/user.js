const express = require('express')
const userController = require('../../controllers/userController')
const router = express.Router()
const upload = require('../../middleware/multer')

// user
router.get('/:id/replied_tweets', userController.getRepliedTweets)
router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id/likes', userController.getLikedTweet)
router.get('/:id/followings', userController.getFollowings)
router.get('/:id/followers', userController.getFollowers)
router.put('/:id', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.putUser)
router.put('/:id/edit', userController.editUser)
router.get('/:id', userController.getUser)
router.get('/', (req, res) => res.send('Hello World!'))

module.exports = router