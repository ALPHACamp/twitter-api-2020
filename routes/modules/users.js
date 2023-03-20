const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/user-controller')

// 登入
router.post('/signin', userController.signIn)

// 粉絲清單
router.get('/:id/followers',)

// 追蹤清單
router.get('/:id/followings',)

// 點讚清單
router.get('/:id/likes',)

// 留言清單
router.get('/:id/replied_tweets',)

// 推文清單
router.get('/:id/tweets',)

// 個人資料
router.get('/:id',)

// 編輯個人資料
router.put('/:id',)

// 註冊
router.post('/', userController.signUp)

module.exports = router
