const express = require('express')
const router = express.Router()

router.get('/login', (req, res) => {
  res.send('Hello Word!')
})

module.exports = router
