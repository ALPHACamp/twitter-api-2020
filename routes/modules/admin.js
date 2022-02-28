const express = require('express')
const passport = require('../../config/passport')
const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')
const { paramsChecker } = require('../../middleware/check-params')
const { adminLogin } = require('../../middleware/login-check')
const router = express.Router()

router.post('/users/login', adminLogin, passport.authenticate('local', { session: false }), adminController.signIn)
router.get('/users', authenticatedAdmin, adminController.getUsers)
router.get('/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/tweets/:id', paramsChecker, authenticatedAdmin, adminController.deleteTweet)

module.exports = router
