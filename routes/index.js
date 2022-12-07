const express = require('express')
const router = express.Router()

router.use('/api', (req, res) => {
  res.json('api test')
})
router.get('/', (req, res) => {
  res.json('Thanks a lot to Lois and Adriene!')
})

module.exports = router
