const router = require('express').Router()
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const { errorHandler } = require('../middleware/error-handler')

router.post('/api/users/signup', userController.signUp)
router.get('/api/tweets', tweetController.getTweets)
router.use('/', errorHandler)

module.exports = router
