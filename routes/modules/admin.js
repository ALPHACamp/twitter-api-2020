'use strict'

const router = require('express').Router()

const passport = require('../../config/passport')
const adminController = require('../../controllers/adminController')
const { authenticated } = require('../../middleware/auth')
const { isAdmin, isAuthAdmin } = require('../../middleware/role-check')
const { signInValidator } = require('../../middleware/validator')

router.post('/login', signInValidator, passport.authenticate('local', { session: false }), isAdmin, adminController.login)
router.get('/users', authenticated, isAuthAdmin, adminController.getUsers)

module.exports = router
