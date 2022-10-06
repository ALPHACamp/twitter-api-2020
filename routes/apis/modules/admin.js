const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/admin-controller')

router.post('/signin', adminController.signIn)

module.exports = router
