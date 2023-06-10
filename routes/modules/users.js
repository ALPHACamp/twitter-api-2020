// require needed modules
const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticated, authenticatedUser } = require('../../middleware/api-auth')

// require controller
const userController = require('../../controllers/user-controller')

// set router
router.post('/login', passport.authenticate('local', { session: false }), userController.login)
router.get('/:id', authenticated, authenticatedUser, userController.getUserInfo)
router.post('/:id', authenticated, authenticatedUser, userController.editUserInfo)
router.post('/', userController.register)

module.exports = router