const express = require('express')
const router = express.Router()

const passport = require('passport')
const userController = require('../../controllers/user-controller')
const { authenticatedAdmin, authenticated } = require('../../middleware/api-auth')
const adminController = require('../../controllers/admin-controller')
const users = require('./user')
const admin = require('./admin')

router.post('/users', userController.signUp)
router.post('/admin/login', passport.authenticate('local', { session: false, failureMessage: true, failWithError: true }), adminController.signIn, adminController.signInFail)
router.post('/users/login', passport.authenticate('local', { session: false, failureMessage: true, failWithError: true }), userController.signIn, userController.signInFail)

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/users', authenticated, users)


module.exports = router
