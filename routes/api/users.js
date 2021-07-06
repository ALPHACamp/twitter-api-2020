const express = require("express")
const router = express.Router()
const userController = require('../../controllers/api/userController')

router.get('/', userController.getUsers)

module.exports = router