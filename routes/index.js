const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const tweet = require('./modules/tweet')
const followship = require('./modules/followship')
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')

const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')

router.post('/login', passport.authenticate('local', { session: false }), userController.logIn)

router.use('/admin', admin)
router.use('/tweets', tweet)
router.use('/followships', followship)

router.get('/users/:id/likes', authenticated, userController.getUserlikes)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/replied_tweets', authenticated, userController.getUserRepliedTweets)

router.get('/users/:id/followings', authenticated, userController.getUserFollowing)
router.get('/users/:id/followers', authenticated, userController.getUserFollower)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, userController.putUser)
router.post('/users', userController.postUsers)


router.post('/users', userController.postUsers)

router.get('/auth', authenticated, (req, res) => res.status(200).json({ status: '200', message: 'JWT success' }))

router.post('/users', authenticated, userController.postUsers)

router.get('/', (req, res) => res.send('Hello World!'))

router.use('/', generalErrorHandler)

module.exports = router
