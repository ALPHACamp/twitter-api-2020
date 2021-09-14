const router = require('express').Router()
let apis = require('./apis')

router.use('/api', apis)
// const userController = require('../controllers/api/userController.js')

// router.get('/api/logout', userController.logout)

module.exports = router
