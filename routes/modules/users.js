const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const upload = require('../../middleware/multer')

router.get('/:id/followings', userController.following)
router.get('/:id/followers', userController.follower)

router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id/replied_tweets', userController.getUserRepliedTweets)
router.get('/:id/likes', userController.getUserLikes)
router.get('/recommendUsers', userController.getRecommendUsers)
router.get('/currentUser', userController.getCurrentUser)

router.get('/:id', userController.getUser)
router.put('/:id', upload.fields([{ name: 'cover' }, { name: 'avatar' }]), userController.editUser)
router.put('/:id/setting', upload.fields([{ name: 'cover' }, { name: 'avatar' }]), userController.modifyUser)




module.exports = router