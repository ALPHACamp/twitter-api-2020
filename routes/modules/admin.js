const express = require('express')
const router = express.Router()
const { authenticated, authenticatedAdmin, adminLoginAuth } = require('../../middleware/auth')
const { generalErrorHandler } = require('../../middleware/error-handler')
const adminController = require('../../controllers/admin-controller')

router.post('/login', adminLoginAuth, adminController.login)
router.delete('/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)
router.get('/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
router.get('/users', authenticated, authenticatedAdmin, adminController.getUsers)


router.use('/', generalErrorHandler)

module.exports = router
