//require needed modules 
const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticated } = require('../../middleware/auth')
const { generalErrorHandler} = require('../../middleware/error-handler')
//之後要加入multer,處理使用者上傳之圖片

//require controller
const userController = require('../../controllers/user-controller')

//set router
router.post('/register', userController.register)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.get('/signin', userController.signInPage)

module.exports = router