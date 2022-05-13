const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const userController = require('../controllers/user-controller')
const { authenticated } = require('../middleware/auth')
const { errorHandler } = require('../middleware/error-handler')
const upload = require('../middleware/multer')

router.post('/api/login', passport.authenticate('local', { session: false }), userController.login)
router.post('/api/users', userController.signUp)
router.get('/api/users/:id', authenticated, userController.getUser)
router.get('/api/users/:id/tweets', authenticated, userController.getUserTweet)
router.get('/api/users/:id/replied_tweets', authenticated, userController.userRepliedTweets)
router.get('/api/users/:id/likes', authenticated, userController.userLikes)
router.get('/api/users/:id/followings', authenticated, userController.userFollowings)
router.get('/api/users/:id/followers', authenticated, userController.userFollowers)
router.put('/api/users/:id', upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), userController.putUser)
router.use('/', errorHandler)

module.exports = router
