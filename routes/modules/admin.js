//require needed modules 
const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticatedAdmin } = require('../../middleware/auth')
const { generalErrorHandler} = require('../../middleware/error-handler')

//require controller
const adminController = require('../../controllers/admin-controller')

//set router
router.post('/signin', passport.authenticate('local', { session: false }), adminController.signIn)

module.exports = router