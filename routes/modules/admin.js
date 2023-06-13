const express = require('express')
const router = express.Router()
const { authenticated, authenticatedUser, authenticatedAdmin } = require('../../middleware/api-auth')
const adminController = require('../../controllers/admin-controller')

router.post('/signin', adminController.signIn)
router.get('/tweets/:id', authenticated, authenticatedAdmin,adminController.getTweet)
router.delete('/tweets/:id',authenticated, authenticatedAdmin, adminController.deleteTweet)
router.get('/tweets', adminController.getTweets)
router.get('/users', authenticated,authenticatedAdmin,adminController.getUsers)

module.exports = router