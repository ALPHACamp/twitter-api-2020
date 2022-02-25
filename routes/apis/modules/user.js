const express = require('express')
const router = express.Router()
const { authenticated } = require('../../../middleware/api-auth')
const userController = require('../../../controllers/apis/user-controller')

router.post('/', userController.signUp)
router.get('/:id/followers', authenticated, userController.getFollowers)
router.get('/:id/tweets', authenticated, userController.getTweets)
router.get('/:id/replied_tweets', userController.getRepliedTweets)
router.get('/:id', authenticated, userController.getUser)
router.put('/:id', authenticated, userController.putUser)

module.exports = router
