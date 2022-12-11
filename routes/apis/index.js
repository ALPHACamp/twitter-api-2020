const express = require('express')
const router = express.Router()

const { generalErrorHandler } = require('../../middleware/error-handler')

router.get('/', (req, res) => {
  res.send('Hello World!')
})
router.use('/', generalErrorHandler)

module.exports = router