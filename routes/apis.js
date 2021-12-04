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
    if (req.user.role === 'admin') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

// 使用者拿到登入路由也許不需要 ??
router.get("/signup", userController.signUpPage);
//  使用者註冊路由
// router.post("/signup", userController.signUp);
router.post("/users", userController.signUp) //暫時測試用
//  使用者登入
router.post('/signIn', userController.signIn)
//  拿到某位使用者資料
router.get("/users/:id", authenticated, userController.getUser);
// router.get("/users/:id", userController.getUser);
//  使用者編輯自己所有資訊
router.put("/users/:id", authenticated, userController.putUser);
// router.put("/users/:id", userController.putUser);
// router.put("/users/:id", authenticated, upload.fields([{ name: 'cover', maxCount: 1 }, { name:'avatar', maxCount: 1 }]), userController.putUser) 
// <--可以傳一個陣列 FILE


// const adminController = require('../controllers/api/adminController.js')
// const userController = require('../controllers/api/userController.js')
// 還要宣告其他的controller

//API新增在這裡

module.exports = router