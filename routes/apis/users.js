const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController.js')
const passport = require('../../config/passport')
const { authenticated } = require('../../middleware/auth')

router.post('/login', userController.userLogin)
router.post('/register',userController.register)
router.get('/:id', authenticated, userController.getUser)




module.exports = router