// admin routes
const express = require('express')
const router = express.Router()
// import controller
const adminController = require('../../controllers/admin-controller')
// import auth
const {
  authenticated,
  authenticatedAdmin,
} = require("../../middleware/api-auth");

router.delete('/signin', adminController.signIn)
router.delete('/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)
router.get('/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.get('/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
module.exports = router
