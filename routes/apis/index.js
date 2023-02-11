const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const followships = require('./modules/followships')
const tweets = require('./modules/tweets')
const users = require('./modules/users')


const passport = require('../../config/passport')
const userController = require('../../controllers/user-controller')
const adminController = require('../../controllers/admin-controller')
const { apiErrorHandler, authErrorHandler } = require('../../middleware/error-handler')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../../middleware/auth')
const multer = require('multer')


router.post('/admin/signin', passport.authenticate('local', { session: false, failWithError: true }), adminController.signIn, authErrorHandler)

router.post('/users/signin', passport.authenticate('local', { session: false, failWithError: true }), userController.signIn, authErrorHandler)

router.post('/users', userController.signUp)


router.get('/current_user', authenticated, userController.getCurrentUser)
router.put('/current_user/:id', authenticated, multer().none(), userController.editCurrentUser)

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.use('/followships', authenticated, authenticatedUser, followships)
router.use('/tweets', authenticated, authenticatedUser, tweets)
router.use('/users', authenticated, authenticatedUser, users)

router.use('/', (req, res) => res.redirect('/api/users'))


router.use('/', apiErrorHandler)


module.exports = router
