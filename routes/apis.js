const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })
const userController = require('../controllers/api/userController')
const adminController = require('../controllers/api/adminController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role) {
      return next()
    }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

// user
router.post('/users', userController.signUp)
router.post('/signin', userController.signIn)
router.put('/users/:id', authenticated, cpUpload, userController.editUser)
router.get('/users/get_current_user', authenticated, userController.getCurrentUser)
router.get('/users/topUsers', authenticated, userController.getTopUsers)
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/replied_tweets', authenticated, userController.getUserReplies)
router.get('/users/:id/followings', authenticated, userController.getUserFollowings)
router.get('/users/:id/followers', authenticated, userController.getUserFollowers)
router.get('/users/:id/likes', authenticated, userController.getUserLikes)


//follow
router.post('/followships/:followingId', authenticated, userController.addFollowing)
router.delete('/followships/:followingId', authenticated, userController.removeFollowing)

// admin
// JWT signin
router.post('/admin/signin', adminController.signIn)
// // 註冊
// router.get('/admin/users', adminController.getUsers)
// // 全部推文資料
// router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
// // 刪除一筆推文
// router.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)

module.exports = router