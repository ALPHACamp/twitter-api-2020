const express = require('express')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const like = require('./modules/like')
const followship = require('./modules/followship')
const passport = require('../config/passport')
const { apiErrorHandler } = require('../middleware/error-handler')

const router = express.Router()


router.post('/api/users/signin', passport.authenticate('local', { session: false }), authenticatedUser, userController.signIn)
router.post('/api/users', userController.signUp) //註冊

router.delete('/api/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)
router.post('/api/admin/users', passport.authenticate('local', { session: false }), authenticatedAdmin, adminController.signIn)

router.get('/api/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.get('/api/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)

router.use('/api/tweets', authenticated, authenticatedUser, like)
router.use('/api/followships', authenticated, authenticatedUser, followship)


router.use('/', apiErrorHandler)

module.exports = router