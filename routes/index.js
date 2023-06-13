const express = require('express')
const router = express.Router()
const passport = require('../config/passport') // 引入 Passport，需要它幫忙做驗證
const userController = require('../controllers/user-controller')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedUser, authenticatedAdmin } = require('../middleware/api-auth')
const upload = require('../middleware/multer') // 載入 multer


router.post('/users/signin', userController.signIn)
router.get('/users/:user_id/tweets', authenticated, authenticatedUser, userController.getUserTweets)
router.get('/users/:user_id/replied_tweets', authenticated, authenticatedUser, userController.getUserRepliedTweets)

router.get('/users/tops', authenticated, authenticatedUser, userController.getTopUsers)

router.post('/users/following/:user_id', authenticated, authenticatedUser, userController.addFollowing)
router.delete('/users/following/:user_id', authenticated, authenticatedUser, userController.removeFollowing)

router.get('/users/:user_id/likes', authenticated, authenticatedUser, userController.getUserLikes)
router.get('/users/:user_id/followings', authenticated, authenticatedUser, userController.getUserFollowings)
router.get('/users/:user_id/followers', authenticated, authenticatedUser, userController.getUserFollowers)
router.get('/users/:user_id/edit', authenticated, authenticatedUser, userController.editUser)
router.put('/users/:user_id', authenticated, authenticatedUser, upload.single('image'), userController.putUser)
router.get('/users/:user_id', authenticated, authenticatedUser, userController.getUser)

router.post('/users', userController.signUp)

router.use('/', apiErrorHandler)

module.exports = router
