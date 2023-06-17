const router = require('express').Router()
const userController = require('../../controllers/pages/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticated, roleChecker, authenticatedAdmin } = require('../../middleware/api-auth')

router.get('/logout', userController.logout)
router.get('/register')
router.get('/login')

router.use('/admin', authenticatedAdmin, roleChecker, userController.enter)
router.use('/', authenticated, userController.enter)
router.use('/', apiErrorHandler)

module.exports = router
