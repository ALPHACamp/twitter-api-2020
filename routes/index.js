const express = require('express')
const router = express.Router()

//controllers
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const likeController = require('../controllers/likeController')
const replyController = require('../controllers/replyController')
const followshipController = require('../controllers/followshipController')

//authorizers
const { authToken, authUserRole, authAdminRole } = require('../middleware/auth')

//routes


//followship
router.post('/api/followships', authToken, authUserRole, followshipController.createFollowship)
router.delete('/api/followships/:id', authToken, authUserRole, followshipController.deleteFollowship)

//users
router.post('/api/login', userController.login)
router.post('/api/users', userController.createUser)

module.exports = router