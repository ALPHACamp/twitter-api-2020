const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const tweet = require('./modules/tweet')
const followship = require('./modules/followship')
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')

const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, userLoginAuth } = require('../middleware/auth')
const upload = require('../middleware/multer')

router.post('/login', userLoginAuth, userController.logIn)

router.use('/admin', admin)
router.use('/tweets', tweet)
router.use('/followships', followship)

router.get('/users/topFollow', authenticated, userController.getTopUser)
router.get('/users/:id/likes', authenticated, userController.getUserlikes)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/replied_tweets', authenticated, userController.getUserRepliedTweets)

router.get('/users/:id/followings', authenticated, userController.getUserFollowing)
router.get('/users/:id/followers', authenticated, userController.getUserFollower)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, upload.single('img'), userController.putUser)
router.post('/users', userController.postUsers)


router.get('/auth', authenticated, userController.getCurrentUser)

router.get('/', (req, res) => res.send('Hello World!'))

router.use('/', generalErrorHandler)

module.exports = router
