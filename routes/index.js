const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

const { generalErrorHandler } = require('../middleware/error-handler')

router.post('/login', passport.authenticate('local', { session: false }), userController.logIn)

router.get('/users/:id', authenticated,userController.getUser)


router.put('/users/:id', authenticated,userController.putUser)

router.post('/users', userController.postUsers)
router.get('/auth', authenticated,(req, res) => res.status(200).json({ status: '200', message: 'JWT success' }))
router.get('/', (req, res) => res.send('Hello World!'))


router.use('/', generalErrorHandler)

module.exports = router
