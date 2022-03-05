const express = require('express')
const router = express.Router()

const { authenticated } = require('../../middleware/auth.js')

const userController = require('../../controllers/userController.js')

const userRouter = require('./user.js')
const adminRouter = require('./admin.js')
const followshipRouter = require('./followship.js')
const tweetRouter = require('./tweet.js')

// current user
router.get('/current_user', authenticated, userController.getCurrentUser)
// user signin
router.post('/signin', userController.signIn)

router.use('/users', userRouter)
router.use('/admin', adminRouter)
router.use('/followships', followshipRouter)
router.use('/tweets', tweetRouter)

module.exports = router
