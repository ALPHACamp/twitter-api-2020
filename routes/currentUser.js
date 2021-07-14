const express = require('express')
const router = express.Router()
const currentUserController = require('../controllers/currentUserController')

router.get('/', currentUserController.getCurrentUser)


module.exports = router