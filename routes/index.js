const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')

router.put('/api/users/:id', userController.putUser)

router.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = router
