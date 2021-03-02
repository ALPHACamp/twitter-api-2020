const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/userController.js')
const tweetController = require('../controllers/tweetController.js')

// //身分認證
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
    if (req.user) {
        if (req.user.isAdmin) { return next() }
        return res.json({ status: 'error', message: 'permission denied' })
    } else {
        return res.json({ status: 'error', message: 'permission denied' })
    }
}

// 登入
router.post('/api/users/signin', userController.signIn)
// 註冊
router.post('/api/users', userController.signUp)

router.get('/api/tweets/:id', authenticated, tweetController.getTweet)
router.put('/api/tweets/:id', authenticated, tweetController.putTweet)
router.delete('/api/tweets/:id', authenticated, tweetController.deleteTweet)
router.post('/api/tweets', authenticated, tweetController.postTweet)
router.get('/api/tweets', authenticated, tweetController.getTweets)


module.exports = router