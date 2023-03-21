const express = require('express')
const router = express.Router()
// const admin = require('./modules/admin')
const userController = require('../../controllers/user-controller')

router.put('/:id/setting', userController.putUserSetting)

module.exports = router
