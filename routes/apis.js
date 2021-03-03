const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const adminController = require('../controllers/api/adminController')
const followController = require('../controllers/api/followController')
const likeController = require('../controllers/api/likeController')
const replyController = require('../controllers/api/replyController')
const tweetController = require('../controllers/api/tweetController')
const userController = require('../controllers/api/userController')

const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user === 'admin') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

// User
router.post('/users', userController.signUp)
router.post('/users/signIn', userController.signIn)
router.get('/users', authenticated, userController.getTopUser)
router.get('/users/:id', userController.getUser)
router.get('/users/:id/tweets', userController.getUserTweets)


// admin
router.post('/admin/signin', adminController.signIn)
router.get('/admin/users', adminController.getUsers)
router.get('/admin/tweets', adminController.getTweets)
router.delete('/admin/tweets/:id', adminController.deleteTweets)

module.exports = router