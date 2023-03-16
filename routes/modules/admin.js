const express = require('express')
const router = express.Router()

const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')

const adminController = require('../../controllers/admin-controller')

router.post('/signin', adminController.signIn) // 後台登入
router.get('/users', authenticated, authenticatedAdmin, adminController.getUsers) // 查看所有使用者
router.delete('/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet) // 刪除特定推文

module.exports = router
