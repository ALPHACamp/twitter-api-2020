const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/apis/admin-controller')
<<<<<<< HEAD
const passport = require('passport')
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')
// router.post('/login', passport.authenticate('jwt', { session: false }), adminController.signIn)
=======

const {
  authenticated,
  authenticatedAdmin
} = require('../../middleware/api-auth')

router.post('/signin', adminController.signIn)
>>>>>>> 4397115c6ac10aa993d100d5a86d715bf599b3af

router.get(
  '/users',
  authenticated,
  authenticatedAdmin,
  adminController.getUsers
)
router.delete(
  '/tweets/:id',
  authenticated,
  authenticatedAdmin,
  adminController.deleteTweet
)
router.get(
  '/tweets',
  authenticated,
  authenticatedAdmin,
  adminController.getTweets
)

module.exports = router
