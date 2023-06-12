const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')

const { apiErrorHandler } = require('../middleware/error-handler')

const adminController = require('../controllers/admin-controller')
const userController = require('../controllers/user-controller')

const { authenticated, isUser, isAdmin, authenticatedUser, authenticatedAdmin } = require('../middleware/auth')

router.post('/api/users', userController.signUp)
router.post('/api/admin/signin', passport.authenticate('local', { session: false }), isAdmin, adminController.signIn)
router.post('/api/users/signin', passport.authenticate('local', { session: false }), isUser, userController.signIn)

router.use('/api/admin', authenticated, authenticatedAdmin, admin)
router.use('/api/users', authenticated, authenticatedUser, users)
router.use('/api/tweets', authenticated, tweets)
router.use('/api/followships', followships)

router.use('/', apiErrorHandler)
router.use('/', (req, res) => res.send('this is home page.')) // for testing

module.exports = router
