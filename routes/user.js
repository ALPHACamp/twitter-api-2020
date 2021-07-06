const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const passport = require('../config/passport')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers')


//   /api/users

router.get('/:id/followers', helpers.authenticated, helpers.authenticatedUser, userController.getUserFollowers)
router.get('/:id/followings', helpers.authenticated, helpers.authenticatedUser, userController.getUserFollowings)
router.get('/:id/likes', helpers.authenticated, helpers.authenticatedUser, userController.getUserLike)
router.get('/:id/replied_tweets', helpers.authenticated, helpers.authenticatedUser, userController.getUserRepliedTweets)
router.get('/:id/tweets', helpers.authenticated, helpers.authenticatedUser, userController.getUserTweets)
router.get('/:id', helpers.authenticated, helpers.authenticatedUser, userController.getUser)
router.put('/:id', helpers.authenticated, helpers.authenticatedUser, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.putUser)

router.post('/signin', userController.signin)
router.post('/', userController.signup)

module.exports = router