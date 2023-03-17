const router = require('express').Router()
const userController = require('../controllers/user-controller')

router.post('/api/users/signup', userController.signUp)

module.exports = router