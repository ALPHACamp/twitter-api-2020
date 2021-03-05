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
const adminController = require('../controllers/adminController.js')
//身分認證
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
// 驗證管理員
const authenticatedAdmin = (req, res, next) => {
    // console.log(req.isAuthenticated(req))
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
// 當前用戶
router.get('/api/users/currentUser', authenticated, userController.getCurrentUser)
// 個人資料
router.get('/api/users/:id', authenticated, userController.getUser)
// 修改個人資料
router.put('/api/users/:id', authenticated, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.putUser)
// 使用者正在追蹤誰
router.get('/api/users/:id/followings', authenticated, userController.getFollowings)
// 誰在追蹤這個使用者
router.get('/api/users/:id/followers', authenticated, userController.getFollowers)
// 看見某使用者發過回覆的推文
router.get('/api/users/:id/replied_tweets', authenticated, userController.getRepliedTweets)
// 看見某使用者點過的 Like 
router.get('/api/users/:id/likes', authenticated, userController.getLikeTweets)
// 看見某使用者發過的推文
router.get('/api/users/:id/tweets', authenticated, userController.getUserTweets)


//admin
router.get('/api/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.get('/api/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
router.delete('/api/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)


// 瀏覽推文
router.get('/api/tweets', authenticated, tweetController.getTweets)
// 修改推文
router.post('/api/tweets', authenticated, tweetController.postTweet)
// 單一推文
router.get('/api/tweets/:id', authenticated, tweetController.getTweet)
// 編輯推文
router.put('/api/tweets/:id', authenticated, tweetController.putTweet)
// 刪除推文
router.delete('/api/tweets/:id', authenticated, tweetController.deleteTweet)
// 新增Like
router.post('/api/tweets/:id/like', authenticated, tweetController.postLike)
// 刪除 Like
router.post('/api/tweets/:id/unlike', authenticated, tweetController.deleteLike)
// 新增回覆
router.post('/api/tweets/:tweet_id/replies', authenticated, tweetController.postReply)
// 瀏覽回覆
router.get('/api/tweets/:tweet_id/replies', authenticated, tweetController.getReplies)
// 刪除回覆
router.delete('/api/replies/:id', authenticated, replyController.deleteReply)
// 
router.put('/api/replies/:id', authenticated, replyController.putReply)


router.post('/api/followships', authenticated, followshipController.postFollowship)
router.delete('/api/followships/:followingId', authenticated, followshipController.deleteFollowship)




module.exports = router
