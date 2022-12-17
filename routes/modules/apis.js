const express = require('express')
const router = express.Router()
const passport = require('passport')

const users = require('../modules/users')
const tweets = require('../modules/tweets')
const followships = require('../modules/followships')
const admin = require('../modules/admin')

const userController = require('../../controllers/userController')
const replyController = require('../../controllers/replyController')
const likeController = require('../../controllers/likeController')
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')
const { signInFail } = require('../../middleware/error-handler')

router.post('/signin', passport.authenticate('local', { session: false, failWithError: true }), userController.signIn, signInFail)

router.use('/users', authenticated, users)
router.use('/tweets', authenticated, tweets)
router.use('/followships', authenticated, followships)
router.use('/admin', authenticated, authenticatedAdmin, admin)

router.post('/tweets/:tweet_id/like', authenticated, likeController.addLike)
router.post('/tweets/:tweet_id/unlike', authenticated, likeController.unLike)

router.post('/tweets/:tweet_id/replies', replyController.postReply)
router.get('/tweets/:tweet_id/replies', replyController.getReplies)

module.exports = router
