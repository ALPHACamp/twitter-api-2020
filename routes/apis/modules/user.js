const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/apis/user-controller')
const { authenticated } = require('../../../middleware/api-auth')

router.post('/', userController.signUp)
// for JWT test purpose
// router.get('/getuser', authenticated, userController.getUser)

module.exports = router
