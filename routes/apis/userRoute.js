const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')

const authenticated = passport.authenticate('jwt', { session: false })

const userController = require('../../controllers/userController')

router.post('/', userController.signUp)
router.get('/top', authenticated, userController.getTopUsers)
router.get('/:user_id', userController.getUser)
router.put('/:user_id', userController.putUser)
router.put('/:user_id/profile', userController.putUser)
router.get('/:user_id/tweets', userController.getTweets)
router.get('/:user_id/replied_tweets', userController.getReplies)
router.get('/:user_id/followings', userController.getFollowings)
router.get('/:user_id/followers', userController.getFollowers)

module.exports = router
