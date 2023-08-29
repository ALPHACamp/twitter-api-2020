const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/apis/admin-controller')
const passport = require('passport')
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')
// router.post('/login', passport.authenticate('jwt', { session: false }), adminController.signIn)

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
router.get('/tweets', adminController.getTweets)

// router.use('/', (req, res) => res.redirect('api/admin/users'))

module.exports = router
