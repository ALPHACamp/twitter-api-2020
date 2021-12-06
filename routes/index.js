const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const helpers = require('../_helpers')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')
const likeController = require('../controllers/likeController')
const followController = require('../controllers/followController')

// const authenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next()
//   }
//   res.redirect('/api/signin')
// }
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === "admin") { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}


//user相關
router.post('/api/signin', userController.signIn)
router.post('/api/signup', userController.signUp)
router.get('/api/user/:id', userController.getUserAccountSetting)
router.put('/api/user/:id', userController.putUserAccountSetting)




//tweets相關
router.get('/api/tweets', authenticated, tweetController.getTweets)
router.get('/api/tweets/:id', authenticated, tweetController.getTweet)
router.post('/api/tweets', authenticated, tweetController.postTweet)
router.get('/api/admin/tweets',authenticated, authenticatedAdmin, tweetController.getAdminTweets)
router.delete('/api/admin/tweets/:id', authenticated, authenticatedAdmin, tweetController.deleteTweet)


//likes相關   待補authenticated
router.post('/api/tweets/:tweetId/like', authenticated, likeController.postLike)
router.post('/api/tweets/:tweetId/unlike', authenticated, likeController.postUnlike)


//replies相關
router.get('/api/tweets/:tweetId/replies', authenticated, replyController.getReplies)
router.post('/api/tweets/:tweetId/replies', authenticated, replyController.postReply)


//followships相關
router.post('/api/followships', authenticated, followController.addFollowship)
router.delete('/api/followships/:followingId', authenticated, followController.deleteFollowship)
router.get('/api/followers/top', authenticated, followController.getTopFollowers)


//admin相關

module.exports = router
