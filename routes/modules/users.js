const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')
const { authenticated, authUser } = require('../../middleware/auth')
const userController = require('../../controllers/user-controller')

router.post('/signin', userController.signin)
router.get('/currentUser', authenticated, userController.getCurrentUser)
router.get('/:id/tweets', authenticated, authUser, userController.getUserTweets)
router.get('/:id/likes', authenticated, userController.getUserLikes)
router.get('/:id/replied_tweets', authenticated, authUser, userController.getUserReplies)
router.get('/:id/followings', authenticated, userController.getUserFollowings)
router.get('/:id/followers', authenticated, userController.getUserFollowers)
router.get('/:id', authenticated, authUser, userController.getUser)
router.put('/:id',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 }]),
  authenticated, authUser, userController.editUser)
router.post('/', userController.signup)

module.exports = router
