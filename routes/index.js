const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/userController.js')

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

module.exports = router