const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')

const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

// router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/admin', admin)

router.put('/users/:id', authenticated, userController.putUser)
router.get('/users/:id', authenticated, userController.getUser)

router.post('/users', authenticated, userController.postUsers)
// router.get('/tweets', authenticated, tweetController.getTweets)
router.get('/tweets', tweetController.getTweets)
router.get('/', (req, res) => res.send('Hello World!'))

router.use('/', generalErrorHandler)

module.exports = router
