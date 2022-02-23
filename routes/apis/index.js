const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')

const admin = require('./modules/admin')

const adminController = require('../../controllers/admin-controllers')
const userController = require('../../controllers/user-controllers')
const tweetController = require('../../controllers/tweet-controllers')

const { authenticated, authenticatedAdmin, authenticatedNoAdmin } = require('../../middleware/api-auth')

router.post('/users/signin',passport.authenticate('local', { session: false }), adminController.login)
router.post('/admin/login',passport.authenticate('local', { session: false }), adminController.login)

router.use('/admin', authenticated, authenticatedAdmin, admin)

router.get('/users/:id', authenticated, userController.getUser)
router.post('/users', userController.signUp)

router.get('/tweets/:tweet_id/replies', authenticated, tweetController.getReplies)


module.exports = router
