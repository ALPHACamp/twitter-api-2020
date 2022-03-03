const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')
const options = [
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]
const { authenticated } = require('../../middleware/auth')
const userController = require('../../controllers/user-controller')

router.post('/', userController.signUp)
router.use(authenticated)
router.get('/top', userController.getTopUsers) 
router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id/likes', userController.getUserLikes)
router.get('/:id/replied_tweets', userController.getUserReplies)
router.get('/:id/followings', userController.getUserFollowings)
router.get('/:id/followers', userController.getUserFollowers)
router.get('/:id', userController.getUser)
router.put('/:id', upload.fields(options), userController.putUser)

module.exports = router