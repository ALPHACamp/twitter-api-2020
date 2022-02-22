const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedUser } = require('../middleware/api-auth')


router.get('/', (req, res) => {
  res.send('Hello World!')
})
router.get('/api/tweets', tweetController.getTweets)
router.post('/api/users', userController.signUp)
router.post('/api/signin', userController.signIn)
router.use('/', apiErrorHandler) //放最後一關檢查

module.exports = router