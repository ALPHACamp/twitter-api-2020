const router = require("express").Router()

const adminController = require("../../controller/admin/adminController")


router.get('/test' , adminController.adminTest)

module.exports = router;