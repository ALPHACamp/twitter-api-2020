const express = require('express')
const router = express.Router()
const { apiErrorHandler } = require('../../middleware/error-handler')
const userController = require('../../controllers/apis/user-controller')
const passport = require('../../config/passport')
const user = require('./modules/user')

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.use('/users', user)
router.use('/', apiErrorHandler)

module.exports = router
