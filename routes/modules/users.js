const express = require('express')
const router = express.Router()
const { authenticated } = require('../../middlewares/auth')

const userController = require('../../controllers/userController')

router.post('/login', userController.logIn)
router.post('/', userController.signUp)
router.get('/:id', authenticated, userController.getUser)
router.get('/:id/tweets', authenticated, userController.getUserTweets)
router.get('/:id/likes', authenticated, userController.getUserLikes)
router.get('/:id/followings', authenticated, userController.getUserFollowings)


module.exports = router
