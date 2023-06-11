const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/apis/user-controller')
const upload = require('../../../middleware/multer')
const profileUpload = upload.fields([{ name: 'coverPhoto', maxCount: 1 }, { name: 'avatar', maxCount: 1 }])
const { authenticated, authenticatedUser } = require('../../../middleware/api-auth')

router.post('/', userController.signUp)
router.put('/:id/account', authenticated, authenticatedUser, userController.putAccount)
router.get('/:id/followers', authenticated, authenticatedUser, userController.getFollowers)
router.get('/:id/followings', authenticated, authenticatedUser, userController.getFollowings)
router.get('/:id/tweets', authenticated, authenticatedUser, userController.getUserTweets)
router.get('/:id/replied_tweets', authenticated, authenticatedUser, userController.getUserRepliedTweets)
router.get('/:id/likes', authenticated, authenticatedUser, userController.getUserLikesTweets)
router.get('/topTen', authenticated, authenticatedUser, userController.getTopTenUsers)
router.get('/:id', authenticated, authenticatedUser, userController.getUser)
router.put('/:id', authenticated, authenticatedUser, profileUpload, userController.putUser)

module.exports = router
