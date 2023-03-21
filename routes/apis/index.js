const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

const userController = require('../../controllers/apis/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
// 還沒用到
// const { authenticated, authenticatedAdmin } = require('../../middleware/auth')

router.post('/users', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.use('/', apiErrorHandler)

module.exports = router
