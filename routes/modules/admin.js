const express = require('express')
const { authenticated, checkRole } = require('../../middleware/auth')
const adminController = require('../../controllers/adminControllers')
const router = express.Router()

router.post('/signin', adminController.adminSignIn)

router.get('/users', authenticated, checkRole('admin'), adminController.getUsers)

router.get('/tweets', authenticated, checkRole('admin'), adminController.getTweets)

router.delete('/tweets/:id', authenticated, checkRole('admin'), adminController.deleteTweet)

module.exports = router
