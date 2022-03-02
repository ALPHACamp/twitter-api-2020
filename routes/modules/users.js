const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
// const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')
const upload = require('../../middleware/multer')

// router.use('/users', users)
// router.post('/signIn', userController.signIn)
router.get('/:id', authenticated, userController.getUser)
router.put('/:id', authenticated,
  upload.fields([{ name: 'avatar' }, { name: 'cover' }]), userController.putUser)
router.post('/', userController.signUp)

// router.use('/', apiErrorHandler)

module.exports = router
