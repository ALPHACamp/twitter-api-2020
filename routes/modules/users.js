const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const { authenticated, authenticatedRole } = require('../../middlewares/auth')

router.post('/signin', userController.signIn)
router.post('/', userController.postUser)
router.put('/:id', authenticated, authenticatedRole(), userController.putUser)
router.get('/current_user', authenticated, userController.getCurrentUser)
router.get('/top', authenticated, authenticatedRole(), userController.getTopUsers)
router.get('/:id/tweets', authenticated, authenticatedRole(), userController.getUserTweets)
router.get('/:id/replied_tweets', authenticated, authenticatedRole(), userController.getUserRepliedTweets)
router.get('/:id/likes', authenticated, authenticatedRole(), userController.getUserLikedTweets)
router.get('/:id/followings', authenticated, authenticatedRole(), userController.getUserFollowings)
router.get('/:id/followers', authenticated, authenticatedRole(), userController.getUserFollowers)
router.get('/:id', authenticated, authenticatedRole(), userController.getUser)

module.exports = router
