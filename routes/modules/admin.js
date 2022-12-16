const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')
const { generalErrorHandler } = require('../../middleware/error-handler')
const { authenticatedAdmin } = require('../../middleware/auth')

const adminController = require('../../controllers/admin-controller')

router.delete('/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
router.get('/tweets', authenticatedAdmin, adminController.getTweets)
router.get('/users', authenticatedAdmin, adminController.getUsers)
router.post('/login', passport.authenticate('local', { session: false }), adminController.login)

router.use('/', generalErrorHandler)

module.exports = router
