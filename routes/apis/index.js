const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')
const userController = require('../../controllers/apis/user-controller')

const { apiErrorHandler } = require('../../middleware/error-handler')

router.post('/users', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.use('/', apiErrorHandler)

module.exports = router
