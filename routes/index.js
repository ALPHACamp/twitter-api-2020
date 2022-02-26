const express = require('express')
const router = express.Router()
const { generalErrorHandler } = require('../helpers/error-handler')
const { authenticated, blockRole } = require('../helpers/auth')

const userController = require('../controllers/user-controllers')

const users = require('./modules/users')
const tweets = require('./modules/tweets')
const admin = require('./modules/admin')
const followships = require('./modules/followships')

// Login & Registration & Current user
router.post('/users/login', userController.login)
router.post('/users/', userController.register)
router.get(
  '/users/get-current-user',
  authenticated,
  userController.getCurrentUser
)

router.use('/admin', authenticated, blockRole('user'), admin)
router.use('/users', authenticated, blockRole('admin'), users)
router.use('/tweets', authenticated, blockRole('admin'), tweets)

router.use('/followships', authenticated, blockRole('admin'), followships)

// fallback route for 404 not found (temporary)
router.get('/', (req, res) => res.send('Hello World!'))

// General error
router.use('/', generalErrorHandler)

module.exports = router
