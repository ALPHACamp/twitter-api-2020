const express = require('express')
const userController = require('../../controllers/userController')
const { authenticated, authenticatedUser } = require('../../middleware/authenticate')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const photoUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])

router.post('/', userController.register)
router.post('/login', userController.login)

router.use(authenticated)
router.get('/current', userController.getCurrentUser)

router.use(authenticatedUser)
router.get('/:id', userController.getUser)
router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id/replied_tweets', userController.getRepliesOfTweet)
router.get('/:id/likes', userController.getLikedTweet)
router.get('/:id/followers', userController.getFollowers)
router.put('/:id', photoUpload, userController.putUser)

module.exports = router
