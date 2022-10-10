const router = require('express').Router()
const passport = require('../../config/passport')
const adminController = require('../../controllers/admin/adminController')
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')

router.post('/login',
  passport.authenticate('local', { session: false }),
  adminController.adminSignIn)
router.get('/users', authenticated, authenticatedAdmin, adminController.getAllUsers)
router.delete('/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)
router.get('/tweets', authenticated, authenticatedAdmin, adminController.getAllTweets)

module.exports = router
