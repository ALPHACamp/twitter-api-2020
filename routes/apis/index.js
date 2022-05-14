const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const userController = require('../../controllers/apis/user-controllers')
const tweetController = require('../../controllers/apis/tweet-controller')
const adminController = require('../../controllers/apis/admin-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const {
  authenticated,
  authenticatedAdmin
} = require('../../middleware/api-auth')

router.post(
  '/signin',
  passport.authenticate('local', { session: false }),
  userController.signIn
)
router.post('/users', userController.signUp)

router.post('/tweets', authenticated, tweetController.postTweet)

router.delete(
  '/admin/tweets/:id',
  authenticated,
  authenticatedAdmin,
  adminController.deleteTweet
)
router.get(
  '/admin/users',
  authenticated,
  authenticatedAdmin,
  adminController.getUsers
)

// router.get('/test', authenticated, (req, res) => {
//   res.send('OK')
// })

router.use('/', apiErrorHandler)

module.exports = router
