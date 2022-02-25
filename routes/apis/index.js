const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const users = require('./modules/users')

const { authenticated } = require('../../middleware/api-auth')
const followshipRouter = require('./modules/followship')
const tweetRouter = require('./modules/tweet')
const { apiErrorHandler } = require('../../middleware/api-error-handler')

const userController = require('../../controllers/user-controller')

router.use('/admin', admin)
router.use('/users', users)
router.post('/login', userController.login)
router.post('/users', userController.postUsers)
router.use('/followships', authenticated, followshipRouter)
router.use('/tweets', authenticated, tweetRouter)

router.use(apiErrorHandler)
module.exports = router