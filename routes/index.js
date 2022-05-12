const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const userController = require('../controllers/user-controller')

// 尚未加入 authenticatedAdmin
const { authenticated, authenticatedUser } = require('../middleware/auth')
const { apiErrorHandler } = require('../middleware/error-handler')

router.post('/users', userController.signUp)
router.post('/signin', passport.authenticate('jwt', { session: false }), authenticatedUser, userController.signIn)

router.get('/users/:id', authenticatedUser, userController.getUser)


router.use('/', apiErrorHandler)

module.exports = router
