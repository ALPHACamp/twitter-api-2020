const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const upload = require('../../middleware/multer')

router.get('/top_followers', userController.getTopUsers)
router.get('/:id/tweets', userController.getUserTweets)
router.put('/:id/setting', userController.putUserSetting)
router.put('/:id', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.putUserProfile)

module.exports = router
