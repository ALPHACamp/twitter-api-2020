const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const userController = require('../../controllers/apis/user-controllers')
const adminController = require('../../controllers/apis/admin-controller')
const { apiErrorHandler, catchAsync } = require('../../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')

router.delete('/admin/tweets/:id', authenticatedAdmin, catchAsync, adminController.deleteTweet)
router.get('/admin/users', authenticated, authenticatedAdmin, catchAsync, adminController.getUsers)

router.post('/users', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/signin', catchAsync, userController.signUp)

router.use('/', apiErrorHandler)

module.exports = router
