const express = require('express')
const router = express.Router()

const apis = require('./apis')

router.use('/api', apis)
router.use((req, res, next) => {
  res.status(404)
  return res.json({ status: 'error', message: `Cannot find ${req.method} ${req.path}` })
})
router.use((error, req, res, next) => {
  res.status(500)
  console.log(error.message)
  return res.json({ status: 'error', message: error.message })
})

module.exports = router
