const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')

const userController = require('../controllers/user-controller')

const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')
const { signupValidation, signinValidation, validateForm } = require('../middleware/validator')
const { errorHandler } = require('../middleware/error-handler')

// 登入
router.post('/users/signin', signinValidation, validateForm, userController.signIn)

router.get('/users/token', authenticated, userController.getUserTokenStatus)
// 註冊
router.post('/users', signupValidation, validateForm, userController.signUp)

router.use('/users', authenticated, authenticatedUser, users)

router.use('/tweets', authenticated, authenticatedUser, tweets)

router.use('/followships', authenticated, authenticatedUser, followships)

router.post('/admin/signin', signinValidation, validateForm, userController.signIn)

router.use('/admin', authenticated, authenticatedAdmin, admin)

router.use('/', (_req, res) => {
  res.status(404).json({ status: 'error', message: 'Page not found' })
})

router.use('/', errorHandler)

module.exports = router
