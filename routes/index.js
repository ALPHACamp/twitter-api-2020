const express = require('express')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const followship = require('./modules/followship')
const passport = require('../config/passport')
const { apiErrorHandler } = require('../middleware/error-handler')

const router = express.Router()


router.post('/api/users/signin', passport.authenticate('local', { session: false }), authenticatedUser, userController.signIn)
router.post('/api/users', userController.signUp) //註冊

router.post('/api/admin/users', passport.authenticate('local', { session: false }), authenticatedAdmin, adminController.signIn)

router.use('/api/followships', authenticated, authenticatedUser, followship)


router.use('/', apiErrorHandler)

module.exports = router