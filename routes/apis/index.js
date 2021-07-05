const express = require('express')
const router = express.Router()

const userRoute = require('./userRoute')
const tweetRoute = require('./tweetRoute')
const followshipRoute = require('./followshipRoute')
const adminRoute = require('./adminRoute')

const userController = require('../../controllers/userController')

const { authenticated, checkRole } = require('../../middlewares/auth')

router.post('/signin', userController.signIn)

router.use('/users', userRoute)
router.use('/tweets', authenticated, checkRole(), tweetRoute)
router.use('/followships', authenticated, checkRole(), followshipRoute)
router.use('/admin', authenticated, checkRole('admin'), adminRoute)

module.exports = router
