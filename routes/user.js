const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const userController = require('../controllers/userController')
const { authenticated } = require('../middlewares/auth')

router.post('/', userController.signUp)
router.put('/:id', authenticated, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.putUser)
router.get('/:id/tweets', authenticated, userController.getUserTweets)
router.get('/:id/followings', authenticated, userController.getUserFollowings)
router.get('/:id', authenticated, userController.getUser)

module.exports = router