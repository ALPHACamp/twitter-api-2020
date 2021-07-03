const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.send('this is /api/tweets router.')
})

module.exports = router
