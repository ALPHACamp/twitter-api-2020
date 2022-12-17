const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')
const upload = require('../../middleware/multer')
const batchUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])

router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id/likes', userController.getLikes)
router.put('/:id', batchUpload, userController.putUserProfile)
router.put('/:id/account', userController.putUserAccount)
router.get('/:id', userController.getUser)
router.post('/', userController.postUser)
router.get('/', userController.getUsers)

module.exports = router
