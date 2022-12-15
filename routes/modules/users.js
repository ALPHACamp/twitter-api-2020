const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')
const userController = require('../../controllers/user-controller')
const {
  authenticatedUser,
  authenticated
} = require('../../middleware/api-auth')

// 登入不需要驗證登入狀態
router.post(
  '/signin',
  passport.authenticate('jwt', { session: false }),
  authenticatedUser,
  userController.signIn
)

router.get('/:id', authenticatedUser, authenticated, userController.getUser)

// 註冊不需要驗證登入狀態
router.post('/', userController.signUp)

module.exports = router
