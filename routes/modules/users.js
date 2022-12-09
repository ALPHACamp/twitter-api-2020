const express = require('express')
const router = express.Router()
const { registerValidator } = require('../../middleware/validator')
const userController = require('../../controllers/user-controller')

// 註冊
router.get('/', (req, res) => res.send('hello world'))
router.post('/', registerValidator, userController.register)

module.exports = router
