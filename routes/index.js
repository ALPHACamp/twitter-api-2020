const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/userController.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// 驗證使用者 middleware 
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
    if (req.user) {
      if (req.user.isAdmin) { return next() }
      return res.json({ status: 'error', message: 'permission denied' })
    } else {
      return res.json({ status: 'error', message: 'permission denied' })
    }
  }

// 登入
router.post('/api/users/signin', userController.signIn)
// 註冊
router.post('/api/users', userController.signUp)
// 個人資料
router.get('/api/users/:id', authenticated, userController.getUser)
// 修改個人資料
router.put('/api/users/:id', authenticated, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.putUser)
// 使用者正在追蹤誰
router.get('/api/users/:id/followings', userController.getFollowings)
// 誰在追蹤這個使用者
router.get('/api/users/:id/followers', userController.getFollowers)


module.exports = router