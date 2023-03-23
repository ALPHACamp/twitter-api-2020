const router = require('express').Router()
const upload = require('../../middleware/multer')
const { authenticatedSelf } = require('../../middleware/auth')
const userController = require('../../controllers/user-controller')

router.get('/:id/likes', userController.getUserLikes)
// 查看特定使用者發過的推文
router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id/replied_tweets', userController.getUserReplies)
router.put('/:id/setting', authenticatedSelf, userController.putUserSetting)
router.get('/:id/setting', authenticatedSelf, userController.getUserSetting)
router.put('/:id', authenticatedSelf, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.putUser)
router.get('/:id', userController.getUser)

module.exports = router
