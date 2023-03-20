const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')

const adminController = require('../controllers/admin-controller')

const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')

const { errorHandler } = require('../middleware/error-handler')

router.use('/users', users)

router.use('/tweets', authenticated, authenticatedUser, tweets)

router.use('/followships', authenticated, authenticatedUser, followships)

router.post('/admin/signin', adminController.signIn)

router.use('/admin', authenticated, authenticatedAdmin, admin)

router.use('/', errorHandler)

module.exports = router
