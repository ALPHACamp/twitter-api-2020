const express = require('express')
const router = express.Router()

const userController = require('../../controllers/userController')

router
  .route('/')
  .get((req, res) => res.send('Hello World!'))
  .post(userController.register)
router.post('/login', userController.login)

module.exports = router
