const express = require('express')
const router = express.Router()
const { authenticated, checkRole } = require('../../middleware/auth')
const validate = require('../../middleware/validate')
const { signUp, signIn, user } = require('../../libs/schema')
const passport = require('../../config/passport')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const userController = require('../../controllers/userController')
const cpUpload = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
])

router.post('/', validate(signUp), userController.signUp)

router.post('/signin', validate(signIn), userController.signIn)

router.get('/currentuser', authenticated, checkRole(), userController.getCurrentUser)

router.get('/topUsers', authenticated, checkRole(), userController.getTopUsers)

router.get('/:id', authenticated, checkRole(), userController.getUser)

router.put('/:id', authenticated, checkRole(), validate(user), cpUpload, userController.putUser)

router.get('/:id/tweets', authenticated, checkRole(), userController.getUserTweets)

router.get('/:id/replied_tweets', authenticated, checkRole(), userController.getUserRepliedTweets)

router.get('/:id/likes', authenticated, checkRole(), userController.getUserLikedTweets)

router.get('/:id/followings', authenticated, checkRole(), userController.getFollowings)

router.get('/:id/followers', authenticated, checkRole(), userController.getFollowers)

router.put('/:id/settings', authenticated, checkRole(), userController.putUserSettings)


module.exports = router
