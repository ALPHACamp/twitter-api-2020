const express = require('express')
const router = express.Router()

const passport = require('../../../config/passport')

const userController = require('../../../controllers/user-controller')

router.get('/:userId/tweets', userController.getUserTweets)
router.get('/:userId/replied-tweets', userController.getUserReplies)
router.get('/:userId/likes', userController.getUserLikes)
router.get('/:userId/followers', userController.getUserFollowers)
router.get('/:userId/followings', userController.getUserFollowings)
router.get('/:userId', userController.getUser)
router.put('/:userId', userController.putUser)
router.patch('/:userId', userController.patchUser)

router.post('/signIn', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/', userController.signUp)

module.exports = router
