'use strict'

const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')
const userController = require('../../controllers/userController')
const { authenticated } = require('../../middleware/auth')
const { signInValidator, signUpValidator } = require('../../middleware/validator')
const { isUser, isAuthUser } = require('../../middleware/role-check')

// signup & signin
router.post('/signin', signInValidator, passport.authenticate('local', { session: false }), isUser, userController.signIn)
router.post('/', signUpValidator, userController.signUp)

// user
router.get('/:id/tweets', authenticated, isAuthUser, userController.getUserTweet)
router.get('/:id/replied_tweets', authenticated, isAuthUser, userController.getUserReply)
router.get('/:id/likes', authenticated, isAuthUser, userController.getUserLike)
router.get('/:id/followings', authenticated, isAuthUser, userController.getUserfollowing)
router.get('/:id/followers', authenticated, isAuthUser, userController.getUserFollower)

module.exports = router
