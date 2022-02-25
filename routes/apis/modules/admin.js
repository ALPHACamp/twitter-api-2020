const express = require('express')
const router = express.Router()

const { authenticated, authenticatedAdmin } = require('../../../middleware/api-auth')
const adminController = require('../../../controllers/admin-controller')

router.post('/login', adminController.login)
router.get('/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.get('/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
router.delete('/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)

module.exports = router
