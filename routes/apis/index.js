const express = require('express')
const router = express.Router()

const userRoute = require('./userRoute')
const tweetRoute = require('./tweetRoute')
const followshipRoute = require('./followshipRoute')
const adminRoute = require('./adminRoute')

const userController = require('../../controllers/userController')

router.post('/signin', userController.signIn)

router.use('/users', userRoute)
router.use('/tweets', tweetRoute)
router.use('/followships', followshipRoute)
router.use('/admin', adminRoute)

module.exports = router
