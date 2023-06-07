//require needed modules 
const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticated } = require('../../middleware/auth')
//之後要加入multer,處理使用者上傳之圖片

//require controller
const userController = require('../../controllers/user-controller')

//set router
router.post('/users/register', userController.register)
router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn)

module.exports = router