'use strict'

const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')
const userController = require('../../controllers/userController')
const { authenticated } = require('../../middleware/auth')
const { isUser, isAuthUser } = require('../../middleware/role-check')
const { signInValidator, signUpValidator } = require('../../middleware/validator')
const upload = require('../../middleware/multer')
const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])

// signup & signin
router.post('/signin', signInValidator, passport.authenticate('local', { session: false }), isUser, userController.signIn)
router.post('/', signUpValidator, userController.signUp)

// user
router.get('/:id/tweets', authenticated, isAuthUser, userController.getUserTweet)
router.get('/:id/replied_tweets', authenticated, isAuthUser, userController.getUserReply)
router.get('/:id/likes', authenticated, isAuthUser, userController.getUserLike)
router.get('/:id/followings', authenticated, isAuthUser, userController.getUserfollowing)
router.get('/:id/followers', authenticated, isAuthUser, userController.getUserFollower)
router.get('/:id', authenticated, isAuthUser, userController.getUser)
router.put('/:id', authenticated, isAuthUser, cpUpload, userController.putUserProfile)
router.patch('/:id', signUpValidator, authenticated, isAuthUser, userController.updateUserAccount)

module.exports = router
