const express = require('express')
const router = express.Router()
const passport = require('../config/passport.js')
const helpers = require('../_helpers.js')

const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === 'admin') return next()
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])

const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController.js')

router.get('/users/:id/tweets', authenticated, userController.getTweets)
router.get('/users/:id/replied_tweets', authenticated, userController.getReplies)
router.get('/users/:id/likes', authenticated, userController.getLikes)
router.get('/users/:id/followings', authenticated, userController.getfollowings)
router.get('/users/:id/followers', authenticated, userController.getfollowers)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, cpUpload, userController.putUser)

router.get('/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.delete('/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)

router.post('/admin', adminController.login)
router.post('/users', userController.register)
router.post('/login', userController.login)

module.exports = router