const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const passport = require('../config/passport')

const tweetController = require('../controllers/api/tweetController')
const userController = require('../controllers/api/userController')
const replyController = require('../controllers/api/replyController')
const helpers = require('../_helpers')
const adminController = require('../controllers/api/adminController')

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

// 拿到當下使用者資料
router.get('/get_current_user', authenticated, userController.getCurrentUser)
// 使用者拿到登入路由也許不需要 ??
router.get("/signup", userController.signUpPage);
//  使用者註冊路由
// router.post("/signup", userController.signUp);
router.post("/users", userController.signUp) //暫時測試用
//  使用者登入
router.post('/signIn', userController.signIn)
//  拿到某位使用者資料

router.get("/users/:id", authenticated, userController.getUser);
// router.get("/users/:id", userController.getUser);
//  使用者編輯自己所有資訊
router.put("/users/:id", upload.single('cover'), authenticated, userController.putUser);
// router.put("/users/:id", userController.putUser);
// router.put("/users/:id", authenticated, upload.fields([{ name: 'cover', maxCount: 1 }, { name:'avatar', maxCount: 1 }]), userController.putUser) 
// <--可以傳一個陣列 FILE


// const adminController = require('../controllers/api/adminController.js')
// const userController = require('../controllers/api/userController.js')
// 還要宣告其他的controller

//API新增在這裡
router.post('/tweets', authenticated, tweetController.postTweet) //新增一篇堆文
router.get('/tweets', authenticated, tweetController.getTweets) //拿到所有推文，包括作者的推文
router.get('/tweets/:id', authenticated, tweetController.getTweet) //拿到一筆推文與回覆

router.post('/tweets/:tweet_id/replies', authenticated,replyController.postReply) //新增一筆推文的回覆
router.get('/tweets/:tweet_id/replies', authenticated, replyController.getReplies) //瀏覽一筆推文的所有回覆

router.post('/tweets/:id/like', authenticated, userController.addLike) //喜歡一則推文
router.post('/tweets/:id/unlike', authenticated, userController.removeLike) //取消喜歡的貼文

router.post('/followships/', authenticated, userController.addFollowing) //新增一位追蹤者
router.delete('/followships/:id', authenticated, userController.removeFollowing) //新增一位追蹤者

router.get('admin/users', authenticated, adminController.getUsers) //管理者可以看見站內所有的使用者 //還要補authenticatedAdmin
router.get('admin/users', authenticated, adminController.deleteTweet) //還要補authenticatedAdmin



module.exports = router