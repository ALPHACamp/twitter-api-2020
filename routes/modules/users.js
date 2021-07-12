const express = require('express')
const router = express.Router()
const { authenticated } = require('../../middlewares/auth')

const userController = require('../../controllers/userController')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

router.post('/login', userController.logIn)
router.post('/', userController.signUp)
router.get('/current_user', authenticated, userController.getCurrentUser)
router.get('/top', authenticated, userController.getTopUsers)

router.put('/:id/settings', authenticated, userController.putUserSettings)
router.get('/:id', authenticated, userController.getUser)
router.get('/:id/tweets', authenticated, userController.getUserTweets)
router.get('/:id/likes', authenticated, userController.getUserLikes)
router.get('/:id/replied_tweets', authenticated, userController.getUserRepliedTweets)
router.get('/:id/followings', authenticated, userController.getUserFollowings)
router.get('/:id/followers', authenticated, userController.getUserFollowers)


module.exports = router
