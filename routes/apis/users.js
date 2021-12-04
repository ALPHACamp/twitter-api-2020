// 載入所需套件
const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const { authenticated, checkNotAdmin } = require('../../middlewares/auth')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

router.post('/', userController.signUp)
router.get('/current_user', authenticated, checkNotAdmin, userController.getCurrentUser)
router.get('/:id', authenticated, checkNotAdmin, userController.getUser)
router.put('/:id', authenticated, checkNotAdmin, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.putUser)
router.put('/:id/setting', authenticated, checkNotAdmin, userController.putUserSetting)
router.get('/:id/tweets', authenticated, checkNotAdmin, userController.getUserTweets)
router.get('/:id/replied_tweets', authenticated, checkNotAdmin, userController.getUserReplies)
router.get('/:id/likes', authenticated, checkNotAdmin, userController.getUserLikes)

// router exports
module.exports = router