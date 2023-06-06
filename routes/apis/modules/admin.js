const router = require('express').Router()
const adminController = require('../../../controllers/apis/admin-controller')

router.post('/users', adminController.adminLogin)

module.exports = router
