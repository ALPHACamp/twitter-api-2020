const express = require('express')

const passport = require('../../config/passport')
const userController = require('../../controllers/user-controller')
const { authenticatedUser } = require('../../middleware/auth')
const { paramsChecker, adminChecker } = require('../../middleware/check-params')
const upload = require('../../middleware/multer')
const cpUpload = upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }])
const router = express.Router()

router.post('/login', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/', userController.signUp)

router.get('/current_user', userController.getCurrentUser)
router.get('/:id/followings', authenticatedUser, paramsChecker, adminChecker, userController.getUserFollowing)
router.get('/:id/followers', authenticatedUser, paramsChecker, adminChecker, userController.getUserFollower)
router.get('/:id/replied_tweets', authenticatedUser, paramsChecker, adminChecker, userController.getUserReply)
router.get('/:id/tweets', authenticatedUser, paramsChecker, adminChecker, userController.getUserTweet)
router.get('/:id/likes', authenticatedUser, paramsChecker, adminChecker, userController.getUserLike)
router.get('/:id', authenticatedUser, paramsChecker, adminChecker, userController.getUserProfile)

router.put('/:id/account', authenticatedUser, paramsChecker, adminChecker, userController.putUserAccount)
router.put('/:id', authenticatedUser, paramsChecker, adminChecker, cpUpload, userController.putUserProfile)

module.exports = router
