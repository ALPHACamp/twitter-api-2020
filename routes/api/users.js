const express = require('express')
const userController = require('../../controllers/api/userController')
const router = express.Router()
const { checkIfLoggedIn, checkIfUser } = require('../../utils/authenticator')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])

router.get('/top', checkIfLoggedIn, checkIfUser, userController.getTopUsers)
router.get('/:id/followers', checkIfLoggedIn, checkIfUser, userController.getFollowers)
router.get('/:id/followings', checkIfLoggedIn, checkIfUser, userController.getFollowings)
router.get('/:id/likes', checkIfLoggedIn, checkIfUser, userController.getLikedTweets)
router.get('/:id/replied_tweets', checkIfLoggedIn, checkIfUser, userController.getRepliedTweets)
router.get('/:id/tweets', checkIfLoggedIn, checkIfUser, userController.getTweets)
router.get('/:id', checkIfLoggedIn, checkIfUser, userController.getUser)

router.put('/:id', checkIfLoggedIn, checkIfUser, cpUpload, userController.putUser)
router.put('/:id/account', checkIfLoggedIn, checkIfUser, userController.putAccount)
// register
router.post('/', userController.register)
// login
router.post('/login', userController.login)

module.exports = router
