const express = require('express')
const passport = require('passport')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const tweets = require('./modules/tweets')
const admin = require('./modules/admin')
const router = express.Router()

router.post('/admin/signin', passport.authenticate('local', { session: false }), adminController.signIn)
router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/tweets', authenticated, tweets)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
module.exports = router
