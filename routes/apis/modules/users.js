const express = require('express')
const router = express.Router()
const upload = require('../../../middleware/multer')

const { authenticated } = require('../../../middleware/api-auth')
const userController = require('../../../controllers/user-controller')
const tempController = require('../../../controllers/temp-controller')

router.get('/top', authenticated, userController.getTopUsers)
router.get('/:id/tweets', authenticated, userController.getTweets)
router.put('/:id/setting', authenticated, userController.putUserSetting)
router.get('/:id/followers', authenticated, tempController.getFollowers)
router.get('/:id/followings', authenticated, tempController.getFollowings)
router.get('/:id/likes', tempController.getLikes)
router.get('/:id/replied_tweets', tempController.getReplies)
router.get('/:id', authenticated, userController.getUser)
router.put('/:id', authenticated, upload.fields([{ name: 'avatar', maxCount: 1 },{ name: 'cover', maxCount: 1 }]), userController.putUser)


exports = module.exports = router