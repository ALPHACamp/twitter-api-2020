const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')

const { apiErrorHandler } = require('../middleware/error-handler.js')

router.post('/api/users/register', userController.registerUser)
router.post('/api/users/login', passport.authenticate('local', { session: false }), userController.loginUser)
router.use('/', apiErrorHandler)

module.exports = router
