const express = require('express')
const router = express.Router()

const apis = require('./apis')

const RequestError = require('../utils/customError')

router.use('/api', apis)
router.use((req, res, next) => {
  res.status(404)
  return res.json({ status: 'error', message: `Cannot find ${req.method} ${req.path}` })
})
router.use((error, req, res, next) => {
  console.log(error.message)
  res.status(500)
  if (error instanceof RequestError) res.status(400)
  return res.json({ status: 'error', message: error.message })
})

module.exports = router
