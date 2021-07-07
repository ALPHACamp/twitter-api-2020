const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/adminController')
const tweetController = require('../../controllers/tweetController')
const userController = require('../../controllers/userController')

const { authenticated, checkRole } = require('../../middlewares/auth')

router.post('/signin', userController.signIn)
router.use(authenticated, checkRole('admin'))
router.get('/tweets', tweetController.getTweetsForAdmin)
router.delete('/tweets/:tweet_id', adminController.deleteTweet)
router.get('/users', adminController.getUsers)

module.exports = router
