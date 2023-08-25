const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')

const userController = require('../../controllers/user-controller')

router.get('/:id/followings', userController.getFollowings)

router.put('/:id', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), userController.putUser)

module.exports = router
