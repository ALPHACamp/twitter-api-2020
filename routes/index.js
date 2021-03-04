const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// 驗證使用者 middleware
const tweetController = require('../controllers/tweetController.js')
const userController = require('../controllers/userController.js')
const replyController = require('../controllers/replyController.js')
const followshipController = require('../controllers/followshipController.js')
// //身分認證
// const authenticated = passport.authenticate('jwt', { session: false })

const authenticated = function (req, res, next) {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (!user) {
            return res
                .status(401)
                .json({ status: "error", message: "No auth token" })
        }
        req.user = user
        return next()
    })(req, res, next)
}

// const authenticatedAdmin = (req, res, next) => {
//   if (req.user) {
//     if (req.user.isAdmin) { return next() }
//     return res.json({ status: 'error', message: 'permission denied' })
//   } else {
//     return res.json({ status: 'error', message: 'permission denied' })
//   }
// }

// 登入
router.post('/api/users/signin', userController.signIn)
// 註冊
router.post('/api/users', userController.signUp)
// 個人資料
router.get('/api/users/:id', authenticated, userController.getUser)
// 修改個人資料
router.put('/api/users/:id', authenticated, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.putUser)
// 使用者正在追蹤誰
router.get('/api/users/:id/followings', userController.getFollowings)
// 誰在追蹤這個使用者
router.get('/api/users/:id/followers', userController.getFollowers)


// 以下功能拿掉authenticated後跑test全部pass，放了會說沒有authenticate，待解決

router.get('/api/tweets', authenticated, tweetController.getTweets)
router.post('/api/tweets', authenticated, tweetController.postTweet)
router.get('/api/tweets/:id', tweetController.getTweet)
router.put('/api/tweets/:id', authenticated, tweetController.putTweet)
router.delete('/api/tweets/:id', authenticated, tweetController.deleteTweet)


router.post('/api/tweets/:id/like', authenticated, tweetController.postLike)
//因為測試檔是用post不是用delete
router.post('/api/tweets/:id/unlike', authenticated, tweetController.deleteLike)


router.post('/api/tweets/:tweet_id/replies', authenticated, tweetController.postReply)
router.get('/api/tweets/:tweet_id/replies', authenticated, tweetController.getReplies)

router.delete('/api/replies/:id', authenticated, replyController.deleteReply)
router.put('/api/replies/:id', authenticated, replyController.putReply)


router.post('/api/followships', authenticated, followshipController.postFollowship)
router.delete('/api/followships/:followingId', authenticated, followshipController.deleteFollowship)


module.exports = router
