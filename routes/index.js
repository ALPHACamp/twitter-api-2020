const router = require('express').Router()
const createError = require('http-errors')
const passport = require('../config/passport')
const errorHandler = require('../middleware/error-handler')
const userController = require('../controllers/user-controller')

router.post('/users/login', (req, res, next) => {
  const { account, password } = req.body
  if (!account || !password) throw createError(400, '欄位不得為空')

  next()
}, passport.authenticate('local', { session: false }), userController.login)

router.post('/users', userController.register)
// 查看特定使用者發過的推文
router.get('/users/:id/tweets', userController.getUserTweets)
router.get('/users/:id/replied_tweets', userController.getUserReplies)

router.use('/', errorHandler)

module.exports = router
