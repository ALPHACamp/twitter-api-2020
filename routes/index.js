const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')

const { generalErrorHandler } = require('../middleware/error-handler')

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.put('/users/:id', userController.putUser)
router.get('/users/:id', userController.getUser)


router.post('/users', userController.postUsers)
router.get('/', (req, res) => res.send('Hello World!'))

router.use('/', generalErrorHandler)

module.exports = router
