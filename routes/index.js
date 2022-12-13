const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')

const userController = require('../controllers/user-controller')

router.put('/api/users/:id', userController.putUser)
router.get('/api/users/:id', userController.getUser)

router.get('/', (req, res) => {
  res.send('Hello World!')
})

router.post('/users', userController.postUsers)
router.use('/', generalErrorHandler)

module.exports = router
