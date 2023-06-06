const router = require('express').Router()
const admin = require('./modules/admin')
const users = require('./modules/users')
const { apiErrorHandler } = require('../middleware/error-handler')

// admin
router.use('/api/admin', admin)

// users
router.use('/api/users', users)

// error (test router delete later)
router.use('/error', (req, res, next) => {
  const error = new Error('This is an error response!')
  next(error)
})

// root (test router delete later)
router.use('/api', (req, res, next) => {
  res.json('/  (Test API Delete Later)')
})

// error handler
router.use('/', apiErrorHandler)

module.exports = router
