const express = require('express')

const passport = require('../../config/passport')
const userController = require('../../controllers/user-controller')
const { authenticated } = require('../../middleware/auth')
const { paramsChecker, adminChecker } = require('../../middleware/check-params')
const upload = require('../../middleware/multer')
const cpUpload = upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }])
const router = express.Router()

router.post('/login', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/', userController.signUp)

router.get('/current_user', authenticated, userController.getCurrentUser)
router.get('/:id/followings', authenticated, paramsChecker, adminChecker, userController.getUserFollowing)
router.get('/:id/followers', authenticated, paramsChecker, adminChecker, userController.getUserFollower)
router.get('/:id/replied_tweets', authenticated, paramsChecker, adminChecker, userController.getUserReply)
router.get('/:id/tweets', authenticated, paramsChecker, adminChecker, userController.getUserTweet)
router.get('/:id/likes', authenticated, paramsChecker, adminChecker, userController.getUserLike)
router.get('/:id', authenticated, paramsChecker, adminChecker, userController.getUserProfile)

router.put('/:id/account', authenticated, paramsChecker, adminChecker, userController.putUserAccount)
router.put('/:id', authenticated, paramsChecker, adminChecker, cpUpload, userController.putUserProfile)

module.exports = router
