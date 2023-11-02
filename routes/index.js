const express = require('express')
const router = express.Router()

const { errorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth-handler')
const userController = require('../controllers/user-controller')
const followshipController = require('../controllers/followship-controller')

// user signup and signin
router.post('/api/users/signin', userController.signIn)
router.post('/api/users', userController.signUp)

router.get('/api/users/:id', authenticated, userController.getUser)

// followship
router.delete('/api/followship/:id', authenticated, followshipController.removeFollowing)
router.post('/api/followship', authenticated, followshipController.addFollowing)

// error hnadler
router.use('/', errorHandler)

module.exports = router
