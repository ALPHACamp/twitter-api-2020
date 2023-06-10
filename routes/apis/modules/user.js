const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/apis/user-controller')
const upload = require('../../../middleware/multer')
const profileUpload = upload.fields([{ name: 'coverPhoto', maxCount: 1 }, { name: 'avatar', maxCount: 1 }])
const { authenticated } = require('../../../middleware/api-auth')

router.post('/', userController.signUp)
router.put('/:id/account', authenticated, userController.putAccount)
router.get('/:id/followers', authenticated, userController.getFollowers)
router.get('/:id/followings', authenticated, userController.getFollowings)
router.get('/:id/tweets', authenticated, userController.getUserTweets)
router.get('/:id/replied_tweets', authenticated, userController.getUserRepliedTweets)
router.get('/:id/likes', authenticated, userController.getUserLikesTweets)
router.get('/:id', authenticated, userController.getUser)
router.put('/:id', authenticated, profileUpload, userController.putUser)
// for JWT test purpose
// router.get('/getuser', authenticated, userController.getUser)

module.exports = router
