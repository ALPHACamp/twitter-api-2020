const express = require('express')
const router = express.Router()
const subscribeshipController = require('../controllers/subscribeshipController')

router.post('/', subscribeshipController.subscribeUser)
router.delete('/:subscribingId', subscribeshipController.unSubscribeUser)

module.exports = router