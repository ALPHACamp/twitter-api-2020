const router = require('express').Router()
const userController = require('../../controllers/pages/user-controller')

router.get('/logout', userController.logout)

module.exports = router
