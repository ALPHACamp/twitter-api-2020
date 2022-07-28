const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')

const { authenticated, authUser } = require('../../middleware/auth')
const userController = require('../../controllers/user-controller')

router.post('/signin', passport.authenticate('jwt', { session: false }), userController.signin)
router.get('/:id', authenticated, userController.getUser)
router.post('/', userController.signup)

module.exports = router
