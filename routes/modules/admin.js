const express = require('express')
const router = express.Router()
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const adminController = require('../../controllers/admin-controller')

router.post('/signin', adminController.signIn)
router.delete('/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)
router.get('/tweets/:id', authenticated, authenticatedAdmin, adminController.getTweet)
router.get('/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.get('/tweets', authenticated, authenticatedAdmin, adminController.getTweets)

module.exports = router