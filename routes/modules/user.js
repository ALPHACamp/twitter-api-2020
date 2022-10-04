const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.put('/:id/setting', userController.putUserSetting)
router.put('/:id', userController.putUserProfile)

module.exports = router
