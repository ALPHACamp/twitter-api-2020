const express = require('express')
const { authenticated } = require('../middleware/auth')
const userController = require('../controllers/user-controller')
const passport = require('../config/passport')
const { apiErrorHandler } = require('../middleware/error-handler')

const router = express.Router()


router.post('/api/users/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/api/users', userController.signUp) //註冊


router.use('/', apiErrorHandler)

module.exports = router