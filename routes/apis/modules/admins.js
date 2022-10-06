const express = require('express')
const router = express.Router()

const passport = require('../../../config/passport')
// const { authenticatedAdmin } = require('../../../helpers/auth-helpers')
const adminController = require('../../../controllers/admin-controller')

router.post('/signin', passport.authenticate('local', { session: false }), adminController.signIn)

module.exports = router
