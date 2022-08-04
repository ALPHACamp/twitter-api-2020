const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const { authenticated, authUser, authAdmin } = require('../middleware/auth')
const { errorHandler } = require('../middleware/error-handler')

router.get('/users/currentUser', authenticated, userController.getCurrentUser)
router.post('/admin/signin', adminController.signin)
router.post('/users/signin', userController.signin)
router.post('/users', userController.signup)

router.use('/admin', authenticated, authAdmin, admin)
router.use('/users', authenticated, authUser, users)
router.use('/tweets', authenticated, tweets)
router.use('/followships', authenticated, authUser, followships)

router.use('/', errorHandler)

module.exports = router
