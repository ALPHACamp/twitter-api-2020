const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')

const admin = require('./modules/admin')

const adminController = require('../../controllers/admin-controllers')
const userController = require('../../controllers/user-controllers')
const tweetController = require('../../controllers/tweet-controllers')
const replyController = require('../../controllers/reply-contoller')

const { authenticated, authenticatedAdmin, authenticatedNoAdmin } = require('../../middleware/api-auth')

router.post('/users/signin',passport.authenticate('local', { session: false }), adminController.login)
router.post('/admin/login',passport.authenticate('local', { session: false }), adminController.login)

router.get('/users/top', authenticated, userController.getTopUsers)
router.get('/users/:id/followings', authenticated, userController.userFollowings)
router.get('/users/:id/followers', authenticated, userController.userFollowers)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id', authenticated, userController.getUser)
router.post('/users', userController.signUp)

router.use('/admin', authenticated, authenticatedAdmin, admin)



router.get('/tweets/:tweet_id/replies', authenticated, tweetController.getReplies)
router.post('/tweets/:tweet_id/replies', authenticated, replyController.postReply)


module.exports = router
