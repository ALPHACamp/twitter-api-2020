const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

const adminController = require('../../controllers/admin-controller')
const { isAdmin, authenticatedAdmin } = require('../../middleware/auth')

module.exports = router
