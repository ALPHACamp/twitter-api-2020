const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/user-controller')
const { imageUpload } = require('../../../middleware/multer')


router.get('/', userController.getUser)
router.get('/:id',  userController.getUser)
router.put('/:id', imageUpload, userController.editUser)
router.get('/:id/top_followers', userController.getTopUsers)
router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id/followers', userController.getUserFollowers)
router.get('/:id/followings', userController.getUserFollowings)
router.get('/:id/replied_tweets', userController.getUserReplies)
router.get('/:id/likes', userController.getUserLikes)

router.get('/', (req, res) => res.send('Hello World!'))



module.exports = router