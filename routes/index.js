const express = require('express')
const router = express.Router()

const apis = require('./apis')

const RequestError = require('../utils/customError')

router.use('/api', apis)
router.use((req, res, next) => {
  return res.status(404).json({ status: 'error', message: `Cannot find ${req.method} ${req.path}` })
})
router.use((error, req, res, next) => {
  console.log(error.message)
  if (error instanceof RequestError) return res.status(400).json({ status: 'error', message: error.message })
  return res.status(500).json({ status: 'error', message: error.message })
})

module.exports = router
