// 載入所需套件
const express = require('express')
const router = express.Router()
const users = require('./apis/users')
const admins = require('./apis/admins')
const tweets = require('./apis/tweets')
const followships = require('./apis/followships')
const messages = require('./apis/message')
const userController = require('../controllers/userController')

router.post('/api/signin', userController.signIn)
router.use('/api/users', users)
router.use('/api/admin', admins)
router.use('/api/tweets', tweets)
router.use('/api/followships', followships)
router.use('/api/messages', messages)


// router exports
module.exports = router