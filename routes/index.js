const express = require('express')
const router = express.Router()
const { authenticated } = require('../middleware/auth')
const { uploadMultiple } = require('../middleware/multer')
const { errorHandler } = require('../middleware/error-handler')
const userController = require('../controllers/user-controller')

router.put('/users/:id/account', authenticated, userController.editUserAccount)
router.put('/users/:id', authenticated, uploadMultiple, userController.editUserProfile)
router.get('/users/:id', authenticated, userController.getUser)
router.post('/users', userController.signup)
router.post('/:role/signin', userController.signin)

router.use('/', errorHandler) // 錯誤處理
module.exports = router
