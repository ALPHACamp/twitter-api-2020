const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')


// const authenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next()
//   }
//   res.redirect('/api/signin')
// }
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role === "admin") { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}


//user相關
router.post('/api/user/signin', userController.signIn)
router.post('/api/user', userController.signUp)
router.get('/api/user/:id', userController.getUserAccountSetting)
router.put('/api/user/:id', authenticated, userController.putUserAccountSetting)
router.get('/api/admin/users', authenticated, userController.getCurrentUser)



//tweets相關  待加上authenticated,
router.get('/api/tweets', tweetController.getTweets)
router.get('/api/tweets/:id', authenticated, tweetController.getTweet)
router.post('/api/tweets', authenticated, tweetController.postTweet)




//likes相關







//replies相關



//followships相關









//admin相關

module.exports = router
