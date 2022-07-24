const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')
const userController = require('../../controllers/user-controller')

router.get('/:id', userController.getUserPage)
router.get('/current_user', userController.getCurrentUser)
router.put('/:id', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.editUser)
router.get('/:id/tweets', userController.getUserTweets)

module.exports = router
