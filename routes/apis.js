const express = require('express')
const router = express.Router()
// const multer = require('multer')
// const upload = multer({ dest: 'temp/' })
const passport = require('../config/passport')
const tweetController = require('../controllers/api/tweetController')

//JWT
const authenticated = passport.authenticate('jwt', { session: false })

// const authenticatedAdmin = (req, res, next) => {
//   if (req.user) {
//     if (req.user.isAdmin) { return next() }
//     return res.json({ status: 'error', message: 'permission denied' })
//   } else {
//     return res.json({ status: 'error', message: 'permission denied' })
//   }
// }

// const adminController = require('../controllers/api/adminController.js')
// const userController = require('../controllers/api/userController.js')
// 還要宣告其他的controller

//API新增在這裡
router.post('/tweets', tweetController.postTweet) //新增一篇堆文
router.get('/tweets', tweetController.getTweets) //拿到所有推文，包括作者的推文
router.get('/tweets/:id', tweetController.getTweet)

module.exports = router