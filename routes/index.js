const express = require('express')
const router = express.Router()
const userController = require('../controller/user-controller')

router.post('/', (req, res) => res.send('Hello World!'))

module.exports = router
