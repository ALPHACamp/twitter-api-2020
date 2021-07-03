const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  return res.send('this is /api/users router.')
})

module.exports = router
