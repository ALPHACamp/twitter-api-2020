const express = require('express')
const router = express.Router()

module.exports = router

// 尚未加入 authenticatedAdmin
const { authenticated, authenticatedUser } = require('../middleware/auth')

// 以下待完成/routes/modules/users.js路由後再補上
