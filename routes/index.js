const express = require('express')
const admin = require('./modules/admin')
const followship = require('./modules/followship')
const tweet = require('./modules/tweet')
const user = require('./modules/user')

const router = express.Router()

const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

// signin for admin
router.post('/api/admin/signin', passport.authenticate('local', { session: false }), userController.signIn)

// signin for normal users
router.post('/api/users/signin', passport.authenticate('local', { session: false }), userController.signIn)

// signup for normal users
router.post('/api/users', userController.signUp)

// get current user for admin and normal user
router.get('/api/current_user', authenticated, userController.getCurrentUser)

// modules
router.use('/api/followship', authenticated, followship)
router.use('/api/tweets', authenticated, tweet)
router.use('/api/admin', authenticated, authenticatedAdmin, admin)
router.use('/api/users', authenticated, user)
router.get('/', (req, res) => res.send('Hello World!'))

// error handler
router.use(generalErrorHandler)
module.exports = router
