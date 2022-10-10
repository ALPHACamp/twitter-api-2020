const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const users = require('./modules/users')
const passport = require('../../config/passport')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../../middleware/auth')
const { apiErrorHandler, authErrorHandler } = require('../../middleware/error-handler')
const userController = require('../../controllers/user-controller')
const adminController = require('../../controllers/admin-controller')


router.post('/users', userController.signUp)

router.get('/users', userController.getUser)

router.post('/admin/signin', passport.authenticate('local', { session: false, failWithError: true }), adminController.signIn, authErrorHandler)
router.post('/users/signin', passport.authenticate('local', { session: false, failWithError: true }), userController.signIn, authErrorHandler)

router.get('/current_user', authenticated, userController.getCurrentUser)
router.put('/current_user/:id', authenticated, userController.editCurrentUser)

router.use('/admin', authenticated, authenticatedAdmin, admin)

router.post('/users/signin', passport.authenticate('local', { session: false, failWithError: true }), userController.signIn, authErrorHandler)
router.post('/users', userController.signUp)


router.get('/users/:id', authenticated ,userController.getUser)
router.get('/users/:id/tweets',authenticated,userController.getUserTweets)
router.get('/users/:id/followers', authenticated,userController.getUserFollowers)
router.get('/users/:id/followings', authenticated, userController.getUserFollowings)
router.get('/users/:id/replied_tweets', authenticated, userController.getUserReplies)
router.get('/users/:id/likes', authenticated, userController.getUserLikes)

router.use('/users', authenticated, users)
router.use('/', (req, res) => res.redirect('/api/users'))
router.use('/', apiErrorHandler)
module.exports = router
