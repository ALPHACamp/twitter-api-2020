const express = require('express')
const passport = require('../../config/passport')
const router = express.Router()
const userController = require('../../controllers/userController')
const { userRole, authenticated, authenticatedUser } = require('../../middleware/auth')
const { signInValidator, signUpValidator } = require('../../middleware/validator')

// signup & signin
router.post('/signin', signInValidator, passport.authenticate('local', { session: false }), userRole, userController.signIn)
router.post('/', signUpValidator, userController.signUp)

// user
router.get('/:id/tweets', authenticated, authenticatedUser, userController.getUserTweet)
router.get('/:id/replied_tweets', authenticated, authenticatedUser, userController.getUserReply)
router.get('/:id/likes', authenticated, authenticatedUser, userController.getUserLike)
router.get('/:id/followings', authenticated, authenticatedUser, userController.getUserfollowing)
router.get('/:id/followers', authenticated, authenticatedUser, userController.getUserFollower)
router.get('/:id', authenticated, authenticatedUser, userController.getUser)
module.exports = router
