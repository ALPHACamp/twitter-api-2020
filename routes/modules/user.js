const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticated } = require('../../middleware/auth')


router.post('/', userController.signup)
router.get('/:UserId', authenticated, userController.getUser)
router.put('/:UserId', authenticated, userController.putUser)
router.get('/:UserId/likes', authenticated, userController.getLikedTweets)
router.get('/:UserId/replied_tweets', authenticated, userController.getRepliedTweets)
router.get('/:UserId/tweets', authenticated, userController.getTweetsOfUser)


module.exports = router