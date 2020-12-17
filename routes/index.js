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

// reply
router.post('/api/tweets/:id/replies', authToken, authUserRole, replyController.createReply)
router.get('/api/tweets/:id/replies', authToken, authUserRole, replyController.getReplies)
router.get('/api/replies/:id', authToken, authUserRole, replyController.getReply)
router.put('/api/replies/:id', authToken, authUserRole, replyController.updateReply)
router.delete('/api/replies/:id', authToken, authUserRole, replyController.deleteReply)

//users
router.post('/api/login', userController.login)
router.post('/api/users', userController.createUser)

module.exports = router