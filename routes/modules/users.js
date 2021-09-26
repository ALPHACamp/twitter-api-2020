const express = require('express')
const router = express.Router()
const { authenticated, checkRole } = require('../../middleware/auth')
const validate = require('../../middleware/validate')
const { signUp, signIn, user, userSettings } = require('../../libs/schema')
const apiError = require('../../libs/apiError')
const multer = require('multer')
const upload = multer({ 
  dest: 'temp/',
  fileFilter(req, files, cb) {
    if (!files.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(apiError.badRequest(415, 'Image file should be jpg, jpeg or png'))
    }
    cb(null, true)
  }
})
const userController = require('../../controllers/userController')
const cpUpload = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
])

router.post('/', validate(signUp), userController.signUp)

router.post('/signin', validate(signIn), userController.signIn)

router.get('/currentuser', authenticated, checkRole(), userController.getCurrentUser)

router.get('/topUsers', authenticated, checkRole(), userController.getTopUsers)

router.get('/topSixUsers', authenticated, checkRole(), userController.getTopSixUsers)

router.get('/:id', authenticated, checkRole(), userController.getUser)

router.put('/:id', authenticated, checkRole(), validate(user), cpUpload, userController.putUser)

router.get('/:id/tweets', authenticated, checkRole(), userController.getUserTweets)

router.get('/:id/replied_tweets', authenticated, checkRole(), userController.getUserRepliedTweets)

router.get('/:id/likes', authenticated, checkRole(), userController.getUserLikedTweets)

router.get('/:id/followings', authenticated, checkRole(), userController.getFollowings)

router.get('/:id/followers', authenticated, checkRole(), userController.getFollowers)

router.put('/:id/settings', authenticated, checkRole(), validate(userSettings), userController.putUserSettings)


module.exports = router
