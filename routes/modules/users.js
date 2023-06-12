// require needed modules
const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticated, authenticatedUser } = require('../../middleware/api-auth')
const { multiUpload } = require('../../middleware/multer')

// require controller
const userController = require('../../controllers/user-controller')

// set router
router.post('/login', passport.authenticate('local', { session: false }), userController.login)
router.get('/:id', authenticated, authenticatedUser, userController.getUserInfo)
router.put('/:id', authenticated, authenticatedUser, multiUpload, userController.editUserInfo)
router.get('/', authenticated, authenticatedUser, userController.getTopUsers)
router.post('/', userController.register)
// router.get('/', userController.getTopUsers)

module.exports = router

