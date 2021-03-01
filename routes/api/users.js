const express = require('express')
const userController = require('../../controllers/api/userController')
const router = express.Router()


router.get('/', (req, res) => res.send('test - users'))
//register
router.post('/', userController.register)

module.exports = router
