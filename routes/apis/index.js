const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const passport = require('../../config/passport')
const { authenticated, authenticatedAdmin, authenticateUser } = require('../../middleware/auth')
const { apiErrorHandler, authErrorHandler } = require('../../middleware/error-handler')
const userController = require('../../controllers/user-controller')
const adminController = require('../../controllers/admin-controller')
const tweetController = require('../../controllers/tweet-controller')


router.post('/users', userController.signUp)

router.get('/users', userController.getUser)

router.post('/admin/signin', passport.authenticate('local', { session: false, failWithError: true }), adminController.signIn, authErrorHandler)
router.post('/users/signin', passport.authenticate('local', { session: false, failWithError: true }), userController.signIn, authErrorHandler)

router.post('/followships', authenticated, authenticateUser, tweetController.addFollow)
router.delete('/followships/:followingId', authenticated, authenticateUser, tweetController.removeFollow)

router.get('/current_user', authenticated, userController.getCurrentUser)
router.put('/current_user/:id', authenticated, userController.editCurrentUser)

router.use('/tweets', authenticated, tweets)
router.use('/admin', authenticated, authenticatedAdmin, admin)

router.post('/users/signin', passport.authenticate('local', { session: false, failWithError: true }), userController.signIn, authErrorHandler)
router.post('/users', userController.signUp)
router.get('/users', userController.getUser)
router.use('/users', authenticated, users)





router.use('/', (req, res) => res.redirect('/api/users'))
router.use('/', apiErrorHandler)
module.exports = router
