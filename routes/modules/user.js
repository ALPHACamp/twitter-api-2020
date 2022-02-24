const express = require('express')

const passport = require('../../config/passport')
const userController = require('../../controllers/user-controller')
const { authenticated } = require('../../middleware/auth')
const { paramsChecker } = require('../../middleware/check-params')
const upload = require('../../middleware/multer')
const cpUpload = upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }])
const router = express.Router()

router.post('/login', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/', userController.signUp)

router.get('/current_user', authenticated, userController.getCurrentUser)
router.get('/:id/replied_tweets', authenticated, paramsChecker, userController.getUserReply)
router.get('/:id/tweets', authenticated, paramsChecker, userController.getUserTweet)
router.get('/:id', authenticated, paramsChecker, userController.getUserProfile)

router.put('/:id', authenticated, paramsChecker, cpUpload, userController.putUserProfile)

module.exports = router
