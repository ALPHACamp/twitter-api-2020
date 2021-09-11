const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const { authenticator } = require('../middlewares/auth')

router.use('/admin', admin)
router.get('/', async (req, res) => {
  res.json('Hello world')
})

module.exports = router
