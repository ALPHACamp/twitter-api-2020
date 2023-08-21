const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const apiErrorHandler = require('../middleware/error-handler')

const userController = require('../controllers/user-controller')

const { User, Like } = require('../models')

router.post('/users', userController.signUp) // 註冊帳號
router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn) // 登入前台帳號

router.get('/test', async (req, res, next) => {
  const like = await Like.create({})
  console.log(like.toJSON())

  const user = await User.create({})
  console.log(user.toJSON())

  return res.json({ data: like.toJSON() })
})

router.use('/', (req, res) => res.status(500).json({ status: 'error', message: 'no such api' })) // fallback路由
router.use('/', apiErrorHandler) // 錯誤處理

module.exports = router
