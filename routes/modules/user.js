const express = require('express')

const passport = require('../../config/passport')
const userController = require('../../controllers/user-controller')
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')
const router = express.Router()

router.post('/login', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/', userController.signUp)

router.get('/:id/tweets', authenticated, userController.getUserTweet)
router.get('/:id', authenticated, userController.getUserProfile)

module.exports = router
