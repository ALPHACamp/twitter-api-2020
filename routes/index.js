const express = require('express')
const router = express.Router()
router.get('/', (req, res) => {
  res.json('Thanks a lot to Lois and Adriene!')
})
module.exports = router
