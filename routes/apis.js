const express = require('express')
const router = express.Router()
const passport = require('passport')
const userController = require('../controllers/userController')

// const multer = require('multer')
// const upload = multer({ dest: 'temp/' })

const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'admin') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

router.get('/', authenticated, (req, res) => res.send('test'))

router.post('/users', userController.signUP)
router.post('/signin', userController.signIn)

module.exports = router