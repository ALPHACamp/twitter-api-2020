const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')
const { apiErrorHandler } = require('../middleware/error-handler.js')

const user = require('./modules/user')
const followship = require('./modules/followship')
const tweet = require('./modules/tweet')
const admin = require('./modules/admin')

router.get('/test-auth', authenticated, (req, res) => {
  res.json({ success: true, error: null })
})
router.get('/test-admin', authenticated, authenticatedAdmin, (req, res) => {
  res.json({ success: true, error: null })
})

router.post('/admin/login', passport.authenticate('local', { session: false }), adminController.loginAdmin)
router.post('/users/login', passport.authenticate('local', { session: false }), userController.loginUser)

router.post('/users', userController.registerUser)
router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/followships', authenticated, followship)
router.use('/tweets', authenticated, tweet)
router.use('/users', authenticated, user)

router.use('/', apiErrorHandler)

module.exports = router
