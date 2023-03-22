const express = require('express')
const router = express.Router()
const { authenticated } = require('../middleware/auth')
const { errorHandler } = require('../middleware/error-handler')
const userController = require('../controllers/user-controller')

router.get('/users/:id', authenticated, userController.getUser)
router.post('/users', userController.signup)
router.post('/:role/signin', userController.signin)

router.use('/', errorHandler) // 錯誤處理
module.exports = router
