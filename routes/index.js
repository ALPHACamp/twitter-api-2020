const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/userController')
const { errorHandler } = require('../middleware/error-handler')

// user
router.post('/signin', passport.authenticate('local', { session: false }), userController.signin)
router.post('/users', userController.signup)

// error handler
router.use('/', errorHandler)

module.exports = router
