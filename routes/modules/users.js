const express = require('express')
const userController = require('../../controllers/userController')
const { authenticated, authenticatedUser } = require('../../middleware/authenticate')
const router = express.Router()

router.post('/', userController.register)
router.post('/login', userController.login)

router.use(authenticated)
router.get('/current', userController.getCurrentUser)

router.use(authenticatedUser)
router.get('/:id', userController.getUser)
router.get('/:id/tweets', userController.getUserTweets)

module.exports = router
