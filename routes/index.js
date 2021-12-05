const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const helpers = require('../_helpers')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')


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


//likes相關







//replies相關  待補authenticated
router.get('/api/tweets/:tweetId/replies', replyController.getReplies)

//followships相關









//admin相關

module.exports = router
