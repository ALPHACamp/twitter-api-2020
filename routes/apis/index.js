const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')

const admin = require('./modules/admin')

const adminController = require('../../controllers/admin-controllers')
const userController = require('../../controllers/user-controllers')
const tweetController = require('../../controllers/tweet-controllers')
const replyController = require('../../controllers/reply-contoller')

const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const upload = require('../../middleware/multer')

router.post('/users/signin', passport.authenticate('local', { session: false }), userController.login)
router.post('/admin/login', passport.authenticate('local', { session: false }), adminController.login)

router.post('/users/signin',passport.authenticate('local', { session: false }), userController.login)
router.post('/admin/login',passport.authenticate('local', { session: false }), adminController.login)

router.use('/admin', authenticated, authenticatedAdmin, admin)

router.get('/users/get_current_user', authenticated, userController.getCurrentUser)
router.get('/users/top', authenticated, userController.getTopUsers)
router.get('/users/:id/followings', authenticated, userController.userFollowings)
router.get('/users/:id/followers', authenticated, userController.userFollowers)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/replied_tweets', authenticated, userController.getReliedTweets)
router.get('/users/:id/likes', authenticated, userController.getLikes)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id/edit', authenticated, userController.editAccount)
router.put('/users/:id', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), authenticated, userController.putUser)
router.post('/users', userController.signUp)

router.get('/tweets/:tweet_id/replies', authenticated, tweetController.getReplies)
router.post('/tweets/:tweet_id/replies', authenticated, replyController.postReply)
router.post('/tweets/:tweet_id/like', authenticated, tweetController.addLike)
router.post('/tweets/:tweet_id/unlike', authenticated, tweetController.removeLike)
router.get('/tweets/:tweet_id', authenticated, tweetController.getTweet)
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)

router.put('/replies/:reply_id', authenticated, replyController.putReply)
router.delete('replies/:reply_id', authenticated, replyController.deleteReply)

router.post('/followships', authenticated, userController.addFollow)
router.delete('/followships/:followingId', authenticated, userController.removeFollow)

module.exports = router
