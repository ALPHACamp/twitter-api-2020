const express = require('express')
const router = express.Router()

const passport = require('passport')

const admin = require('./modules/admin')

const adminController = require('../../controllers/admin-controllers')
const userController = require('../../controllers/user-controllers')

const { authenticated, authenticatedAdmin, authenticatedNoAdmin } = require('../../middleware/api-auth')

router.post('/users/signin',passport.authenticate('local', { session: false }), authenticatedNoAdmin, adminController.login)
router.post('/admin/login',passport.authenticate('local', { session: false }), authenticatedAdmin, adminController.login)
router.post('/users', authenticated, authenticatedAdmin, userController.signUp)

router.use('/admin', authenticated, authenticatedAdmin, admin)

module.exports = router
