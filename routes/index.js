const router = require('express').Router()
const createError = require('http-errors')
const passport = require('../config/passport')
const errorHandler = require('../middleware/error-handler')
const userController = require('../controllers/user-controller')

router.post('/users/login', (req, res, next) => {
  const { account, password } = req.body
  // if (!account || !password) throw createError(400, '欄位不得為空')
  if (!account || !password) return next(createError(400, '欄位不得為空'))

  next()
}, passport.authenticate('local', { session: false }), userController.login)

router.use('/', errorHandler)

module.exports = router
