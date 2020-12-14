const express = require('express')
const router = express.Router()
const passport = require('../config/passport')


const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'Admin') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

const tweetController = require('../controllers/tweetController')
const userController = require('../controllers/userController')

//登入登出
router.post('/signin', userController.signIn)
router.get('/', authenticated, (req, res) => res.render('tweets'))

//tweets
router.get('/tweets', authenticated, tweetController.getTweets)

module.exports = router