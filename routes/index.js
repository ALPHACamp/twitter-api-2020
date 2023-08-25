const express = require('express')
const router = express.Router()

const tweets = require('./modules/tweets')
const followships = require('./modules/followships')
const passport = require('../config/passport')
const admin = require('./modules/admin')
const users = require('./modules/users')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const { generalErrorHandler } = require('../middleware/error-handler')

const { authenticatedUser, authenticatedAdmin } = require('../middleware/auth')

router.post('/api/users/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/api/users', userController.signUp)
router.use('/api/users', authenticatedUser, users)

router.post('/api/admin/signin', passport.authenticate('local', { session: false }), adminController.signIn)
router.use('/api/admin', authenticatedAdmin, admin)

router.use('/api/tweets', authenticatedUser, tweets)

router.use('/api/followships', authenticatedUser, followships)

router.get('/', (req, res) => res.send('hello world'))

router.use('/', generalErrorHandler)

module.exports = router
