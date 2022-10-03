const express = require('express')
const router = express.Router()
const passport = require('../../../config/passport')
const { authenticated } = require('../../../middleware/api-auth')
const userController = require('../../../controllers/user-controller')

router.post('/', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.get('/:id', authenticated, userController.getProfile)
router.put('/:id', authenticated, userController.putProfile)

module.exports = router
