const express = require('express')
const router = express.Router()
const { checkIfLoggedIn, checkIfAdmin } = require('../../utils/authenticator')
const adminController = require('../../controllers/api/adminController')

router.get('/users', checkIfLoggedIn, checkIfAdmin, adminController.getUsers)
router.get('/tweets', checkIfLoggedIn, checkIfAdmin, adminController.getTweets)
router.delete('/tweets/:id', checkIfLoggedIn, checkIfAdmin, adminController.removeTweet)

// admin login
router.post('/login', adminController.login)
module.exports = router
