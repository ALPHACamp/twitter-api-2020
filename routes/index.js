const express = require('express')
const router = express.Router()

const users = require('./apis/users')
const admin = require('./apis/admin')
const tweets = require('./apis/tweets')
const followships = require('./apis/followships')
const chatroom = require('./apis/chatroom')



router.use('/api/chat',  chatroom)
router.use('/api/users',  users)
router.use('/api/admin',  admin)
router.use('/api/tweets', tweets)
router.use('/api/followships',  followships)


module.exports = router