const express = require('express')
const router = express.Router()

const userRoute = require('./userRoute')
const tweetRoute = require('./tweetRoute')
const followshipRoute = require('./followshipRoute')
const adminRoute = require('./adminRoute')
const chatRoute = require('./chatRoute')

const userController = require('../../controllers/userController')

const { authenticated, checkRole } = require('../../middlewares/auth')

router.post('/signin', userController.signIn)
router.get('/current_user', authenticated, userController.getCurrentUser)

router.use('/users', userRoute)
router.use('/tweets', authenticated, checkRole(), tweetRoute)
router.use('/followships', authenticated, checkRole(), followshipRoute)
router.use('/admin', adminRoute)

router.use('/chat', authenticated, checkRole(), chatRoute)

module.exports = router
