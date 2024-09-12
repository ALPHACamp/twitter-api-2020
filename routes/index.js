// express
const express = require('express')
const router = express.Router()

// call controller
const testController = require('../controllers/api/testController.js')

router.get('/test', testController.getTestData)

module.exports = router
