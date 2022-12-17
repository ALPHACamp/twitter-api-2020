const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')
const upload = require('../../middleware/multer')
const batchUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])

router.get('/:id/replied_tweets', userController.getRepliedTweets)
router.get('/:id/followers', userController.getFollowers)
router.get('/:id/followings', userController.getFollowings)
router.get('/:id/likes', userController.getLikes)
router.put('/:id/account', userController.putUserAccount)
router.put('/:id', batchUpload, userController.putUserProfile)
router.get('/:id', userController.getUser)
router.post('/', userController.postUser)
router.get('/', userController.getUsers)

module.exports = router
