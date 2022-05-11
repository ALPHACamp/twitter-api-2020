const express = require('express')
const router = express.Router()
const passport = require('passport')
const { errorHandler } = require('../middleware/error-handler')
const userController = require('../controllers/user-controller')

const admin = require('./modules/admin')
const user = require('./modules/user')
const followship = require('./modules/followship')

const { authenticated, authenticatedUser, authenticatedAdmin } = require('../middleware/auth')

const passportAuth = passport.authenticate('local', { session: false })

router.post('/users', userController.register)
router.post('/users/login', passportAuth, authenticatedUser, userController.login)
router.post('/admin/login', passportAuth, authenticatedAdmin, userController.login)

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/users', authenticated, authenticatedUser, user)
router.use('/followships', authenticated, authenticatedUser, followship)

router.use('/', errorHandler)

module.exports = router
