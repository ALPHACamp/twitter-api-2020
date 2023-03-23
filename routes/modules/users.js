const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const upload = require('../../middleware/multer')

router.get('/:id/followers', userController.getUserFollowers)
router.get('/:id/followings', userController.getUserFollowings)
router.get('/:id/likes', userController.getUserLikes)
router.get('/:id', userController.getUser)
router.put('/:id/setting', userController.putUserSetting)
router.put('/:id', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'coverPage', maxCount: 1 }]), userController.putUser)

module.exports = router
