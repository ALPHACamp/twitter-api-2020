const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController.js')
const { authenticated } = require('../../middleware/auth')

const multer  = require('multer')
const upload = multer({// 確定圖片格式 jpg、jpeg、png
  fileFilter(req, file, cb){
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    cb(new Error('Please upload an image'))
  }
    cb(null, true)
  },
  limit: {
    fileSize: 1000000
  },
  dest: 'temp/'
})
const userImageUpload = upload.fields([{ name: 'avatar', maxCount: 1}, { name: 'cover', maxCount: 1 } ])

router.post('/login', userController.userLogin)
router.get('/tweets', authenticated, userController.getTweets)
router.get('/top', userController.getTopUsers)
router.get('/:id/followers', userController.getFollowers)
router.get('/:id/followings', userController.getFollowings)
router.get('/:id/likes', userController.getLikedTweets)
router.get('/:id/tweets', authenticated, userController.getUserTweets)
router.post('/:id/setting', authenticated, userController.putUserSetting)
router.get('/:id', authenticated, userController.getUser)
router.put('/:id', authenticated, userImageUpload, userController.putUser)
router.post('/', userController.register)







module.exports = router