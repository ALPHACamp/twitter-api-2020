const express = require('express')
const router = express.Router()
const { errorHandler } = require('../middleware/error-handler')
const userController = require('../controllers/user-controller')

router.post('/users', userController.signup)
router.post('/:role/signin', userController.signin)

router.use('/', errorHandler) // 錯誤處理
module.exports = router
