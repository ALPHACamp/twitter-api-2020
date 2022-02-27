const express = require('express')
const router = express.Router()
const userController = ('../controllers/user-controller')

router.post('/api/users', userController.signUp)
router.get('/api/users:id', userController.getUser)
module.exports = router
