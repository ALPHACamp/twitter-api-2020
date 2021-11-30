const express = require('express')
const router = express.Router()
const passport = require('passport')
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')

// const multer = require('multer')
// const upload = multer({ dest: 'temp/' })

const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedUser = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'user') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}
const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'admin') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

router.get('/', authenticated, authenticatedUser, (req, res) => res.send('test'))

//user
router.post('/users', userController.signUP)
router.post('/signin', userController.signIn)

//admin
router.post('/admin/signin', adminController.signIn)
router.get('/admin', authenticated, authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)

module.exports = router