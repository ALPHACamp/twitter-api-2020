const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const adminController = require('../../controllers/admin-controller')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const userController = require('../../controllers/user-controller')

router.get('/test-auth', authenticated, (req, res) => {
  res.json({ success: true, error: null })
})
router.get('/test-admin', authenticated, authenticatedAdmin, (req, res) => {
  res.json({ success: true, error: null })
})
router.post('/admin/login', passport.authenticate('local', { session: false }), adminController.loginAdmin)
router.post('/users/login', passport.authenticate('local', { session: false }), userController.loginUser)

module.exports = router
