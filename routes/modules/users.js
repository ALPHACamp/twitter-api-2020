const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const { authenticated, authenticatedRole } = require('../../middlewares/auth')

router.post('/signin', userController.signIn)
router.post('/', userController.postUser)
router.get('/current_user', authenticated, authenticatedRole(), userController.getCurrentUser)
router.get('/:id/tweets', authenticated, authenticatedRole(), userController.getUserTweets)
router.get('/:id', authenticated, authenticatedRole(), userController.getUser)

module.exports = router
