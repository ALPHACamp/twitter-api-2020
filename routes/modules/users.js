'use strict'

const express = require('express')
const router = express.Router()

const userController = require('../../controllers/userController')
const { signUpValidator } = require('../../middleware/validator')

// signup & signin
router.post('/', signUpValidator, userController.signUp)

module.exports = router
