const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const { apiErrorHandler } = require('../middleware/error-handler')
router.get('/', (req, res) => {
  res.send('Hello World!')
})

router.post('/api/users', userController.signUp)
router.use('/', apiErrorHandler) //放最後一關檢查

module.exports = router