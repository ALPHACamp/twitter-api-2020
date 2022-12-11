const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')

router.get('/users', userController.getCurrentUser)
// router.get('/users/:id', userController.getUser)

router.use('/', (req, res) => {
  res.json('api test main')
})

module.exports = router
