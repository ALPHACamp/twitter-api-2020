// express
const express = require('express')
const router = express.Router()

// call controller
const testController = require('../controllers/testController.js')

router.get('/test', testController.getTestData)

module.exports = router
