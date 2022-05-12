const express = require('express')
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const adminController = require('../controllers/admin-controller')
const router = express.Router()
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')

const admin = require('./models/admin')

router.post('/api/admin/login', passport.authenticate('local', { session: false }), adminController.login)
router.use('/api/admin', authenticated, authenticatedAdmin, admin)
router.post('/api/login', passport.authenticate('local', { session: false }), userController.login)
router.post('/api/tweets', authenticated, tweetController.create)

module.exports = router
