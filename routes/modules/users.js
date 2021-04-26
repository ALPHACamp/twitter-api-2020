const express = require('express')
const userController = require('../../controllers/userController')
const { authenticated, authenticatedUser } = require('../../middleware/authenticate')
const router = express.Router()

router.post('/', userController.register)
router.post('/login', userController.login)

router.use(authenticated)
router.get('/current', userController.getCurrentUser)

router.use(authenticatedUser)
router.get('/top', userController.getTopUsers)
router.get('/:id', userController.getUser)
router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id/replied_tweets', userController.getRepliesOfTweet)
router.get('/:id/likes', userController.getLikedTweet)

module.exports = router
