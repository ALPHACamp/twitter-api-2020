// 載入所需套件
const express = require('express')
const router = express.Router()
const users = require('./apis/users')
const userController = require('../controllers/userController')

router.post('/api/signin', userController.signIn)
router.use('/api/users', users)

// router exports
module.exports = router