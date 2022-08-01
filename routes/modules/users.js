const express = require('express')
const router = express.Router()

const { authenticated, authUser } = require('../../middleware/auth')
const userController = require('../../controllers/user-controller')

router.post('/signin', userController.signin)
router.get('/:id/tweets', authenticated, authUser, userController.getUserTweets)
router.get('/:id/likes', authenticated, userController.getUserLikes)
router.get('/:id', authenticated, authUser, userController.getUser)
router.post('/', userController.signup)

module.exports = router
