const express = require('express')
const router = express.Router()
const { switchAuthenticatedMiddleware } = require('../../_helpers')

const userController = require('../../controllers/userController')

router.post('/login', userController.logIn)
router.post('/', userController.signUp)
router.get('/:id', switchAuthenticatedMiddleware(), userController.getUser)
router.get('/:id/tweets', switchAuthenticatedMiddleware(), userController.getUserTweets)

module.exports = router
