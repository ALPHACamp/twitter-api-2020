//require needed modules 
const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticatedAdmin } = require('../../middleware/auth')

//require controller
const adminController = require('../../controllers/admin-controller')

//set router
router.post('/admin/signin', passport.authenticate('local', { session: false }), adminController.signIn)

module.exports = router