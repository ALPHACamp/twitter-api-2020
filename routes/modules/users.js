const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
// const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticated, authenticatedUser, authenticatedAdmin } = require('../../middleware/auth')
const upload = require('../../middleware/multer')

// router.use('/users', users)
// router.post('/signIn', userController.signIn)
router.get('/users/:id', authenticated, authenticatedUser, userController.getUser)
router.put('/users/:id', authenticated, authenticatedUser,
  upload.fields([{ name: 'avatar' }, { name: 'cover' }]), userController.putUser)
router.post('/users', userController.signUp)

// router.use('/', apiErrorHandler)

module.exports = router
