const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const users = require('./modules/users')
const passport = require('../../config/passport')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../../middleware/auth')
const { apiErrorHandler, authErrorHandler } = require('../../middleware/error-handler')
const userController = require('../../controllers/user-controller')
const adminController = require('../../controllers/admin-controller')

router.post('/admin/signin', passport.authenticate('local', { session: false, failWithError: true }), adminController.signIn, authErrorHandler)
router.use('/admin', authenticated, authenticatedAdmin, admin)

router.post('/users/signin', passport.authenticate('local', { session: false, failWithError: true }), userController.signIn, authErrorHandler)
router.post('/users', userController.signUp)
router.get('/users', userController.getUser)
router.use('/users', authenticated, users)





router.use('/', (req, res) => res.redirect('/api/users'))
router.use('/', apiErrorHandler)
module.exports = router
