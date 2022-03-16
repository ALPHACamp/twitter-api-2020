const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')

router.post('/signin', adminController.signIn)

router.use(authenticated, authenticatedAdmin)

router.get('/tweets', adminController.getTweets)
router.delete('/tweets/:id', adminController.deleteTweet)
router.get('/users', adminController.getUsers)


module.exports = router