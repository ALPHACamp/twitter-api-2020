const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const { authenticated } = require('../middleware/api-auth')
const { apiErrorHandler } = require('../middleware/error-handler.js')

const user = require('./modules/user')
const followship = require('./modules/followship')

router.post('/users/login', passport.authenticate('local', { session: false }), userController.loginUser)
router.post('/users', userController.registerUser)
router.use('/followship', authenticated, followship)
router.use('/users', authenticated, user)

router.use('/', apiErrorHandler)

module.exports = router
