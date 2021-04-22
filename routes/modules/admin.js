const express = require('express')
const adminController = require('../../controllers/adminController')
const { authenticated, authenticatedAdmin } = require('../../middleware/authenticate')
const router = express.Router()

router.post('/login', adminController.login)

router.use(authenticated, authenticatedAdmin)
router.get('/users', adminController.getUsers)

module.exports = router
