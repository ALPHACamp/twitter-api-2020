const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')
const { generalErrorHandler } = require('../../middleware/error-handler')

const adminController = require('../../controllers/admin-controller')

router.delete('/tweets/:id', adminController.deleteTweet)
router.get('/tweets', adminController.getTweets)
router.get('/users', adminController.getUsers)
router.post('/login', passport.authenticate('local', { session: false }), adminController.login)

router.use('/', generalErrorHandler)

module.exports = router
