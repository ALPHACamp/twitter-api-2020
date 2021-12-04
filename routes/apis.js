const express = require('express')
const router = express.Router()
// const multer = require('multer')
// const upload = multer({ dest: 'temp/' })
const passport = require('../config/passport')
const tweetController = require('../controllers/api/tweetController')

const userController = require('../controllers/api/userController')
const replyService = require('../service/replyService')
const helpers = require('../_helpers')

//JWT
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (helpers.gerUser(req)) {
    if (helpers.gerUser(req).isAdmin) { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}
// 使用者拿到登入路由也許不需要 ??
router.get("/signup", userController.signUpPage);
//  使用者註冊路由
router.post("/signup", userController.signUp);
// const adminController = require('../controllers/api/adminController.js')
// const userController = require('../controllers/api/userController.js')
// 還要宣告其他的controller

//API新增在這裡
router.post('/tweets', authenticated, tweetController.postTweet) //新增一篇堆文
router.get('/tweets', authenticated, tweetController.getTweets) //拿到所有推文，包括作者的推文
router.get('/tweets/:id', authenticated, tweetController.getTweet) //拿到一筆推文與回覆

router.post('/tweets/:id/replies', authenticated, replyService.postReply) //新增一筆推文的回覆
router.get('/tweets/:id/replies', authenticated, replyService.getReplies) //瀏覽一筆推文的所有回覆

router.post('/tweets/:id/like', authenticated, userController.addLike) //喜歡一則推文
router.post('/tweets/:id/unlike', authenticated, userController.removeLike) //取消喜歡的貼文

router.post('/followships/', authenticated, userController.addFollowing) //新增一位追蹤者
router.delete('/followships/:id', authenticated, userController.removeFollowing) //新增一位追蹤者




module.exports = router