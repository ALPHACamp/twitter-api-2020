const express = require("express")
const router = express.Router()
const userController = require('../../controllers/api/userController')

router.get('/', userController.getUsers)
router.post('/', userController.postUser)
router.get('/:id', userController.getUser)
router.put('/:id', userController.putUser)

module.exports = router