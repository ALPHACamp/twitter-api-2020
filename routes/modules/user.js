const express = require('express')

const passport = require('../../config/passport')
const userController = require('../../controllers/user-controller')
const { authenticated } = require('../../middleware/auth')
const { paramsChecker } = require('../../middleware/check-params')
const router = express.Router()

router.post('/login', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/', userController.signUp)

router.get('/:id/replied_tweets', authenticated, paramsChecker, userController.getUserReply)
router.get('/:id/tweets', authenticated, paramsChecker, userController.getUserTweet)
router.get('/:id', authenticated, paramsChecker, userController.getUserProfile)

module.exports = router
