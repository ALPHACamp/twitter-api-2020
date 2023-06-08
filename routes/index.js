const express = require('express')
const router = express.Router()
const passport = require('../config/passport') // 引入 Passport，需要它幫忙做驗證
const userController = require('../controllers/user-controller')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/api-auth')
const upload = require('../middleware/multer') // 載入 multer


router.post('/signin', passport.authenticate('local', { session: false }), userController.signin)
router.get('/users/:userId/tweets', authenticated, userController.getUserTweets)
router.get('/users/:userId/replied_tweets', authenticated, userController.getUserRepliedTweets)

router.get('/users/:userId/likes', authenticated, userController.getUserLikes)

router.get('/users/:userId/followings', authenticated, userController.getUserFollowings)
router.get('/users/:userId/followers', authenticated, userController.getUserFollowers)
router.get('/users/:userId/edit', authenticated, userController.editUser)
router.put('/users/:userId', authenticated, upload.single('image'), userController.putUser)
router.get('/users/:userId', authenticated, userController.getUser)
router.get('/users/tops', authenticated, userController.getTopUsers)
router.post('/users', userController.signUp)

router.use('/', apiErrorHandler)

module.exports = router
