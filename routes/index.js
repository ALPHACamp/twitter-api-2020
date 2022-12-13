const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')

const { apiErrorHandler } = require('../middleware/error-handler.js')

router.post('/users/login', passport.authenticate('local', { session: false }), userController.loginUser)

router.get('/users', userController.getUsers)
router.post('/users', userController.registerUser)
router.use('/', apiErrorHandler)

module.exports = router
