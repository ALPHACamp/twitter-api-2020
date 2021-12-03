const express = require('express')
const router = express.Router()
// const multer = require('multer')
// const upload = multer({ dest: 'temp/' })
const passport = require('../config/passport')

const userController = require('../controllers/api/userController')

//JWT
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}
// 使用者拿到登入路由也許不需要 ??
router.get("/signup", userController.signUpPage);
//  使用者註冊路由
router.post("/signup", userController.signUp);
//  使用者登入
router.post('/signIn', userController.signIn)
// const adminController = require('../controllers/api/adminController.js')
// const userController = require('../controllers/api/userController.js')
// 還要宣告其他的controller

//API新增在這裡

module.exports = router