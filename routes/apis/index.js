const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const users = require('./modules/users')
const passport = require('../../config/passport')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../../middleware/auth')
const { apiErrorHandler } = require('../../middleware/error-handler')
const userController = require('../../controllers/user-controller')

router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.get('/users', userController.getUser)
router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/users', authenticated, users)

  
router.get('/', (req, res) => res.send('Hello World!'))

router.use('/', apiErrorHandler)
module.exports = router
