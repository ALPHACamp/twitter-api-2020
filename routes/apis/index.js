const express = require('express')
const router = express.Router()
const userController = ('../controllers/user-controller')

const users = require('./modules/users')

router.use('/users', users)

module.exports = router