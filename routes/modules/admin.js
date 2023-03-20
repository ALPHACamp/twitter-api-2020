const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')


router.delete('/tweets/:id',)

router.get('/tweets', adminController.getTweet)

router.get('/users',)

// 管理者登入
router.post('/signin', adminController.signIn)

module.exports = router

