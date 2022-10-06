const express = require('express')
const router = express.Router()

const passport = require('../../../config/passport')
const { authenticatedAdmin, authenticated  } = require('../../../helpers/auth-helpers')
const adminController = require('../../../controllers/admin-controller')

router.get('/users', adminController.getUsers)
router.post('/signin', passport.authenticate('local', { session: false }), adminController.signIn) // 後台登入

module.exports = router
