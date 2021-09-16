const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const userController = require('../controllers/userController')
const { authenticated } = require('../middlewares/auth')

router.post('/', userController.signUp)
router.get('/top', authenticated, userController.getTopUser)
router.get('/current', authenticated, userController.getCurrentUser)
router.put('/:id', authenticated, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.putUser)
router.get('/:id/replied_tweets', authenticated, userController.getUserReplies)
router.get('/:id/likes', authenticated, userController.getUserLikedTweets)
router.get('/:id/tweets', authenticated, userController.getUserTweets)
router.get('/:id/followings', authenticated, userController.getUserFollowings)
router.get('/:id/followers', authenticated, userController.getUserFollowers)
router.get('/:id', authenticated, userController.getUser)

module.exports = router