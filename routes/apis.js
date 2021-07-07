const express = require('express')
const router = express.Router()
const passport = require('passport')
const helpers = require('../_helpers.js')

const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController.js')
const followshipController = require('../controllers/followshipController.js')
const likeController = require('../controllers/likeController.js')

// jwt驗證
const authenticated = passport.authenticate('jwt', { session: false })
// 驗證登入者是否為管理者=>用於後台路由
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === 'admin') { return next() }
    return res.json({ status: 'error', message: '非管理者沒有權限登入後台！' })
  } else {
    return res.json({ status: 'error', message: '未通過身份驗證！' })
  }
}
// 驗證登入者是否為非管理者=>用於前台路由
const authenticatedNotAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === 'normal') { return next() }
    return res.json({ status: 'error', message: '管理者沒有權限登入前台！' })
  } else {
    return res.json({ status: 'error', message: '未通過身份驗證！' })
  }
}

// user routes
router.post('/users', userController.signUp)
router.post('/signin', userController.signIn)
router.get('/users/:id', userController.getUser)
// admin routes
router.post('/admin/signin', authenticatedNotAdmin, adminController.signIn)

// followship
router.post('/followships', authenticated, authenticatedNotAdmin, followshipController.addFollowing)
router.delete('/followships/:followingId', authenticated, authenticatedNotAdmin, followshipController.removeFollowing)

// like
router.post('/tweets/:id/like', authenticated, authenticatedNotAdmin, likeController.addLike)
router.post('/tweets/:id/unlike', authenticated, authenticatedNotAdmin, likeController.removeLike)

module.exports = router
