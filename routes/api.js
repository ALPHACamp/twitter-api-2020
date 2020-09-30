const express = require('express')
const router = express.Router()
const passport = require('../config/passport.js')
const helpers = require('../_helpers.js')

const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === 'admin') return next()
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

const userController = require('../controllers/userController.js')

router.get('/users/:id/tweets', authenticated, userController.getTweets)
router.get('/users/:id/replied_tweets', authenticated, userController.getReplies)
router.get('/users/:id/likes', authenticated, userController.getLikes)
router.get('/users/:id/followings', authenticated, userController.getfollowings)
router.get('/users/:id/followers', authenticated, userController.getfollowers)

router.post('/users', userController.register)
router.post('/login', userController.login)

module.exports = router