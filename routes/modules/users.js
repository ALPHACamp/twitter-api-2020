const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const { authenticated, authenticatedUser } = require('../../middleware/auth')

const multer = require('multer')

const upload = multer({
  dest: 'temp/',
  fileFilter: (req, files, cb) => {
    if (!files.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(null, false, res.status(400).json({ status: 'error', message: 'Only accept .jpg,.jpeg,.png pictures' }))
    }
    cb(null, true)
  },
  limits: {
    fileSize: 1000000,
    files: 2
  }
})
const imageUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])

router.post('/', userController.signUp)
router.post('/signin', userController.signIn)

router.use(authenticated)

router.get('/', userController.getTopUsers)
router.get('/current', userController.getCurrentUser)
router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id', userController.getUser)
router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id/replied_tweets', userController.getUserReplies)
router.get('/:id/likes', userController.getUserLikes)
router.get('/:id/followings', userController.getUserFollowings)
router.get('/:id/followers', userController.getUserFollowers)

router.use(authenticatedUser)
router.put('/:id/account', userController.editAccount)
router.put('/:id', imageUpload, userController.editUserProfile)

module.exports = router
