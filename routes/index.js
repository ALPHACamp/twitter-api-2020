const express = require('express')
const router = express.Router()

const APIController = require('../controllers/APItest-controller')

router.get('/api/test', APIController.getTestJSON)

module.exports = router