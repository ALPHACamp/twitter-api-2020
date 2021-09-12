const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { authenticated } = require('../middlewares/auth')

router.post('/', userController.signUp)
router.get('/:id', authenticated, userController.getUser)

module.exports = router