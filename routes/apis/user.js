const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const { authenticated, authenticatedNotAdmin } = require('../../middleware/auth.js')

const userController = require('../../controllers/userController.js')

// user routes
router.post('/', userController.signUp)

router.use(authenticated, authenticatedNotAdmin) // 下方路由皆須身份驗證

router.get('/top', userController.getTopFollowedUsers)
router.get('/:id', userController.getUser)
router.get('/:id/likes', userController.getLikedTweets)
router.get('/:id/replied_tweets', userController.getReplies)
router.get('/:id/tweets', userController.getTweets)
router.get('/:id/followings', userController.getFollowings)
router.get('/:id/followers', userController.getFollowers)
router.put('/:id',
  upload.fields([{ name: 'avatar', max: 1 }, { name: 'cover', max: 1 }]), userController.putUser)
router.put('/:id/edit', userController.editUser)
router.delete('/:id/cover', userController.removeCover)

module.exports = router
