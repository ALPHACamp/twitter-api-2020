const express = require('express')
const passport = require('passport')
const router = express.Router()
const { apiErrorHandler } = require('../../middleware/error-handlers')
const userController = require('../../controllers/apis/user-controller')
const adminController = require('../../controllers/apis/admin-controller')
const tweetController = require('../../controllers/apis/tweet-controller')

router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/users', userController.signUp)
router.post('/admin/signin', passport.authenticate('local', { session: false }), adminController.signIn)
router.post('/tweets/:id/like', tweetController.addLike)
router.post('/tweets/:id/unlike', tweetController.removeLike)
router.use('/', apiErrorHandler)

module.exports = router
