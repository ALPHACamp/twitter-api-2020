const router = require('express').Router()

const adminController = require('../../controllers/admin/adminController')

router.get('/test', adminController.adminTest)

module.exports = router
