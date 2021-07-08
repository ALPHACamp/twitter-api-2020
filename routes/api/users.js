const express = require("express")
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const imageFields = [{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]
const userController = require('../../controllers/api/userController')




const followController = require('../../controllers/api/followController')

router.get('/', userController.getUsers)
router.post('/', userController.postUser)
router.get('/:id', userController.getUser)
router.put('/:id', upload.fields(imageFields), userController.putUser)
router.get('/:id/followings', followController.getUserFollowings)
router.get('/:id/tweets', tweetController.getUserTweets)
router.get('/:id/replied_tweets', replyController.getRepliedTweets)


router.get('/:id/likes', likeController.getUserLikes)

router.get('/:id/followers', followController.getUserFollowers)

module.exports = router