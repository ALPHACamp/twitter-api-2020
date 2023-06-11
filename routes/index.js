const express = require('express')
const passport = require('../config/passport')
const router = express.Router()
const admin = require('./modules/admin')
const userController = require('../controllers/apis/user-controller')
const adminController = require('../controllers/apis/admin-controller')
const tweetController = require('../controllers/apis/tweet-controller')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')

// router.use('/admin', authenticated, authenticatedAdmin, admin)

// if  req.user.role = admin 才能登入
router.post('/api/admin/signin', passport.authenticate('local', { session: false, failWithError: true }), adminController.signIn)
// if  req.user.role = admin 不能登入
router.post('/api/signin', (req, res, next) => {
  if (!req.body.account || !req.body.password) res.status(400).json({ status: 'error', message: "Account and Password is required" })
  next()
},
  passport.authenticate('local', { session: false }), userController.signIn,
)
router.post('/api/signup', userController.signUp)
router.get('/api/tweets', authenticated, tweetController.getTweets)

router.get('/api/users/:id', authenticated, userController.getUser)
router.get('/api/users/:id/edit', authenticated, userController.editUser)
router.use('/', apiErrorHandler)

module.exports = router
