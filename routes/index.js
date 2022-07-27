const express = require('express')
const { authenticated } = require('../middleware/auth')
const userController = require('../controllers/user-controller')
const passport = require('../config/passport')
const { apiErrorHandler } = require('../middleware/error-handler')

const router = express.Router()

// 測試用
router.post('/api/echo', function (req, res, next) {
  const body = req.body
  res.json(body)
})

// router.post('/api/signin', passport.authenticate('local', { failureRedirect: '/api/signin' }), userController.signIn)
router.post('/api/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.get('/api/signin', userController.signInPage)
router.get('/api/signup', userController.signUpPage)
router.post('/api/signup', userController.signUp)
router.get('/api/logout', userController.logout)

// router.get('/', authenticated, (req, res) => { res.send('Hi!') })

router.use('/', apiErrorHandler)

module.exports = router