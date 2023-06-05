const router = require('express').Router()
const passport = require('../../config/passport')
const admin = require('./modules/admin')
const userController = require('../../controllers/apis/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')

// 測試postman 是否正常運作
router.get('/', (req, res) => {
  res.json({ status: 'success', data: 'Hello world' })
})

// 有關admin的routes
router.use('/admin', admin)

router.post('/signup', userController.signUp)
router.post('/login', passport.authenticate('local', { session: false }), userController.login) // 缺少session

router.use('/', apiErrorHandler)

module.exports = router
