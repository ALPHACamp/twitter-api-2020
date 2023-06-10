const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

const userController = require('../../controllers/user-controller')
const { isUser, authenticatedUser } = require('../../middleware/auth')

module.exports = router
