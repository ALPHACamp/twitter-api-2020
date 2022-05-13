const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const users = require('./modules/users')
const { authenticated, authenticatedUser,
  authenticatedAdmin } = require('../middleware/auth')
const userController = require('../controllers/user-controller')
const { apiErrorHandler } = require('../middleware/error-handler')

router.post('/admin/signin', passport.authenticate('local', { session: false }), authenticatedAdmin, userController.signIn)
router.post('/signin', passport.authenticate('local', { session: false }), authenticatedUser, userController.signIn)
router.post('/users', userController.signUp)

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/users', authenticated, authenticatedUser, users)




router.get('/users/:id', authenticated, userController.getUser)

router.use('/', apiErrorHandler)
module.exports = router