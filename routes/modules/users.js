const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const upload = require('../../middleware/multer')
const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }])

router.get('/:user_id/replied_tweets', userController.getRepliesOfTweet)
router.get('/:user_id/tweets', userController.getTweetsOfUser)
router.get('/:user_id/likes', userController.getLikesOfUser)
router.get('/:user_id/followings', userController.getFollowingsOfUser)
router.get('/:user_id/followers', userController.getFollowersOfUser)
router.get('/:user_id', userController.getUser)
router.put('/:user_id', cpUpload, userController.editUser)

module.exports = router
