'use strict'

const router = require('express').Router()

const passport = require('../../config/passport')
const adminController = require('../../controllers/adminController')
const { authenticated } = require('../../middleware/auth')
const { isAdmin, isAuthAdmin } = require('../../middleware/role-check')
const { signInValidator } = require('../../middleware/validator')

router.delete('/tweets/:id', authenticated, isAuthAdmin, adminController.deleteTweet)
router.post('/login', signInValidator, passport.authenticate('local', { session: false }), isAdmin, adminController.login)
<<<<<<< HEAD
router.get('/users', authenticated, isAuthAdmin, adminController.getUsers)
router.get('/tweets', authenticated, adminController.getTweets)
=======

router.delete('/tweets/:id', authenticated, isAuthAdmin, adminController.deleteTweet)
router.get('/users', authenticated, isAuthAdmin, adminController.getUsers)
router.get('/tweets', authenticated, isAuthAdmin, adminController.getTweets)
>>>>>>> feature/admin-get-tweets

module.exports = router
