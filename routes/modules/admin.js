const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const adminController = require('../../controllers/admin-controller')
// const upload = require('../../../middleware/multer')
const { authenticatedAdmin } = require('../../middleware/auth')

router.post('/signin', passport.authenticate('local', { session: false }), authenticatedAdmin, adminController.signIn)

module.exports = router
