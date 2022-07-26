const express = require('express')
const router = express.Router()

// const { authenticated, isAdmin } = require('../../middleware/auth')
const adminController = require('../../controllers/admin-controller')

router.post('/signin', adminController.signin)

module.exports = router
