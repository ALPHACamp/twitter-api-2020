const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const { authenticated } = require('../middleware/api-auth')
const { apiErrorHandler } = require('../middleware/error-handler.js')
const user = require('./modules/user')

router.post('/users/login', passport.authenticate('local', { session: false }), userController.loginUser)
router.post('/users', userController.registerUser)
router.use('/users', authenticated, user)
router.post('/followships', userController.addFollowing)
router.delete('/followships/:userId', userController.removeFollowing)
// router.get('/users/:userId', authenticated, userController.getUser)
// router.get('/users?top=', authenticated, userController.getTopUsers)
// router.get('/users', authenticated, userController.getUsers)

router.use('/', apiErrorHandler)

module.exports = router
