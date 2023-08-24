const express = require('express')
const router = express.Router()

const { authenticated, authenticatedAdmin } = require('../middleware/auth')

module.exports = router
