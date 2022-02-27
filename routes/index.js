const express = require('express')
const router = express.Router()
const userController = ('../controllers/user-controller')

router.post('/api/users', userController.signUp)
module.exports = router