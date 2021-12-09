const express = require('express')
const router = express.Router()
const { authenticated, checkNotRole } = require('../../middlewares/auth')

const userController = require('../../controllers/userController')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

router.post('/login', userController.logIn)
router.post('/', userController.signUp)
router.get('/current_user', authenticated, userController.getCurrentUser)
router.get('/top', authenticated, checkNotRole('admin'), userController.getTopUsers)
router.put('/:id', authenticated, checkNotRole('admin'), upload.fields([{ name: 'avatar' }, { name: 'cover' }]), userController.putUser)
router.put('/:id/settings', authenticated, checkNotRole('admin'), userController.putUserSettings)
router.get('/:id', authenticated, checkNotRole('admin'), userController.getUser)
router.get('/:id/tweets', authenticated, checkNotRole('admin'), userController.getUserTweets)
router.get('/:id/likes', authenticated, checkNotRole('admin'), userController.getUserLikes)
router.get('/:id/replied_tweets', authenticated, checkNotRole('admin'), userController.getUserRepliedTweets)
router.get('/:id/followings', authenticated, checkNotRole('admin'), userController.getUserFollowings)
router.get('/:id/followers', authenticated, checkNotRole('admin'), userController.getUserFollowers)

module.exports = router
