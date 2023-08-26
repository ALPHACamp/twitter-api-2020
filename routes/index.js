const express = require('express')
const router = express.Router()

const users = require('./modules/users')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')
const admin = require('./modules/admin')
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const { generalErrorHandler } = require('../middleware/error-handler')

const { authenticatedUser, authenticatedAdmin } = require('../middleware/auth')

router.post('/api/users/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/api/users', userController.signUp)

router.post('/api/admin/signin', passport.authenticate('local', { session: false }), adminController.signIn)
router.use('/api/admin', authenticatedAdmin, admin)

router.use('/api/tweets', authenticatedUser, tweets)

router.use('/api/followships', authenticatedUser, followships)

router.use('/api/users', authenticatedUser, users)

router.get('/', (req, res) => res.send('hello world'))

router.use('/', generalErrorHandler)

module.exports = router
