const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/apis/admin-controller')

const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
// router.post('/login', passport.authenticate('jwt', { session: false }), adminController.signIn)
router.post('/signin', adminController.signIn)
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
