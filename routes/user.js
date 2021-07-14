const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers')

router.post('/signin', userController.signin)
router.post('/', userController.signup)

router.use(helpers.authenticated)

router.get('/:id/followers', userController.getUserFollowers)
router.get('/:id/followings', userController.getUserFollowings)
router.get('/:id/likes', userController.getUserLike)
router.get('/:id/replied_tweets', userController.getUserRepliedTweets)
router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id', userController.getUser)
router.put('/:id/info', userController.putUserInfo)
router.put('/:id', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.putUser)

module.exports = router