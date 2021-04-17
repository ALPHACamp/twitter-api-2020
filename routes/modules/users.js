const express = require('express')
const router = express.Router()

const { authenticated } = require('../../middleware/auth')

const userController = require('../../controllers/userController')

router
  .route('/')
  .get(authenticated, (req, res) => res.send('Hello World!'))
  .post(userController.register)
router.post('/login', userController.login)

module.exports = router
