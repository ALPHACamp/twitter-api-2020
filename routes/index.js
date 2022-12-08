const express = require('express')
const router = express.Router()

router.use('/', (req, res) => {
  res.json('api test main')
})

module.exports = router
