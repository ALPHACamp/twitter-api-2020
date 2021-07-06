const express = require('express')
const router = express.Router()
// const helpers = require('../../_helpers')
// const passport = require('passport')

const userController = require('../../controllers/userController')

router.post('/login', userController.logIn)
router.post('/', userController.signUp)

module.exports = router
