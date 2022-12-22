const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const tweet = require('./modules/tweet')
const followship = require('./modules/followship')
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')

const { generalErrorHandler } = require('../middleware/error-handler')
const { userAuthenticated, userLoginAuth ,admintokenAuthenticated} = require('../middleware/auth')
const upload = require('../middleware/multer')
router.post('/login', userLoginAuth, userController.logIn)

router.use('/admin', admin)
router.use('/tweets', tweet)
router.use('/followships', followship)

router.get('/users/topFollow', userAuthenticated, userController.getTopUser)
router.get('/users/:id/likes', userAuthenticated, userController.getUserlikes)
router.get('/users/:id/tweets', userAuthenticated, userController.getUserTweets)
router.get('/users/:id/replied_tweets', userAuthenticated, userController.getUserRepliedTweets)

router.get('/users/:id/followings', userAuthenticated, userController.getUserFollowing)
router.get('/users/:id/followers', userAuthenticated, userController.getUserFollower)
router.get('/users/:id', userAuthenticated, userController.getUser)
router.put('/users/:id', userAuthenticated ,upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]),userController.putUser)
router.post('/users', userController.postUsers)

router.get('/auth', userAuthenticated, userController.getCurrentUser)
router.get('/auth/admin', admintokenAuthenticated, userController.getCurrentAdmin)

router.get('/', (req, res) => res.send('Hello World!'))

router.use('/', generalErrorHandler)

module.exports = router
