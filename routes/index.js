const express = require('express')
const router = express.Router()

const apis = require('./apis')

router.use('/api', apis)
router.use((req, res, next) => {
  res.status(404)
  const { statusCode: status } = res
  return res.json({ status, message: `Cannot find ${req.method} ${req.path}` })
})
router.use((error, req, res, next) => {
  res.status(500)
  const { statusCode: status } = res
  return res.json({ status, message: error.message })
})

module.exports = router
