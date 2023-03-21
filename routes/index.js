const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const userController = require('../controllers/user-controller')

const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')
const { apiErrorHandler } = require('../middleware/error-handler')