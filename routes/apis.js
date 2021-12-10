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
  if (helpers.getUser(req).role === 'user') {
    return res.status(401).json({ status: 'error', message: '帳號不存在！' })
  }
  return next()
}

const authenticatedUser = (req, res, next) => {
  if (helpers.getUser(req).role === 'admin') {
    return res.status(401).json({ status: 'error', message: '帳號不存在！' })
  }
  return next()
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

//取得追蹤人數前10的使用者
router.get('/users/top', authenticated, authenticatedUser, userController.getTopUsers)

//取得所有追蹤者的資料
router.get("/users/:id/followers", authenticated, authenticatedUser, userController.getFollowers)
//取得正在追蹤的使用者的資料
router.get("/users/:id/followings", authenticated, authenticatedUser, userController.getFollowings)

router.get("/users/:id", authenticated, authenticatedUser, userController.getUser);
// router.get("/users/:id", userController.getUser);


//  使用者編輯自己所有資訊
// router.put("/users/:id", upload.single('cover'), authenticated, authenticatedUser, userController.putUser);
// router.put("/users/:id", upload.array('cover',2), authenticated, authenticatedUser, userController.putUser);
router.put("/users/:id", authenticated, upload.fields([{ name: 'cover', maxCount: 1 }, { name:'avatar', maxCount: 1 }]),  userController.putUser)
// 第二張圖片
router.put("/users/:id/img2", authenticated,  upload.fields([{ name: 'cover', maxCount: 1 }, { name:'avatar', maxCount: 1 }]),  userController.putUser2)  
// <--可以傳一個陣列 FILE


//  查詢user的所有推文
// router.get('/users/:userId/tweets', authenticated, authenticatedUser, upload.single('cover'), userController.getUserTweets)
router.get('/users/:userId/tweets', authenticated, authenticatedUser,  upload.fields([{ name: 'cover', maxCount: 1 }, { name:'avatar', maxCount: 1 }]), userController.getUserTweets)
// 查詢user的所有likes的推文
// router.get('/users/:userId/likes', authenticated,upload.single('cover'), userController.getUserLikes)
router.get('/users/:userId/likes', authenticated, upload.fields([{ name: 'cover', maxCount: 1 }, { name:'avatar', maxCount: 1 }]), userController.getUserLikes)

router.get('/users/:userId/likesTweet', authenticated, upload.fields([{ name: 'cover', maxCount: 1 }, { name:'avatar', maxCount: 1 }]), userController.getUserLikesTweet)

//  查詢user的所有留言
// router.get('/users/:userId/replies', authenticated,upload.single('cover'), userController.getUserReplies)
router.get('/users/:userId/replies', authenticated, upload.fields([{ name: 'cover', maxCount: 1 }, { name:'avatar', maxCount: 1 }]), userController.getUserReplies)

// router.get('/users/:userId/replies', authenticated,upload.single('cover'), userController.getUserReplies)


// router.put("/users/:id", authenticated, upload.fields([{ name: 'cover', maxCount: 1 }, { name:'avatar', maxCount: 1 }]), userController.putUser) 
// <--可以傳一個陣列 FILE


// const adminController = require('../controllers/api/adminController.js')
// const userController = require('../controllers/api/userController.js')
// 還要宣告其他的controller

//API新增在這裡
router.post('/tweets', authenticated, authenticatedUser, tweetController.postTweet) //新增一篇堆文
router.get('/tweets', authenticated, authenticatedUser, tweetController.getTweets) //拿到所有推文，包括作者的推文
router.get('/tweets/:id', authenticated, authenticatedUser, tweetController.getTweet) //拿到一筆推文與回覆

router.post('/tweets/:tweet_id/replies', authenticated, authenticatedUser, replyController.postReply) //新增一筆推文的回覆
router.get('/tweets/:tweet_id/replies', authenticated, authenticatedUser, replyController.getReplies) //瀏覽一筆推文的所有回覆


router.post('/tweets/:id/like', authenticated, authenticatedUser, userController.addLike) //喜歡一則推文
router.post('/tweets/:id/unlike', authenticated, authenticatedUser, userController.removeLike) //取消喜歡的貼文

router.post('/followships/:id', authenticated, authenticatedUser, userController.addFollowing) //新增一位追蹤者
router.delete('/followships/:id', authenticated, authenticatedUser, userController.removeFollowing) //新增一位追蹤者

router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers) //管理者可以看見站內所有的使用者
router.get('/admin/users/:id', authenticated, authenticatedAdmin, adminController.getUser) //管理者可以看見站內所有的使用者
router.get('/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets) //管理者可以看見站內所有的使用者
router.delete('/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)

//DARK MAGIC FOR DESTROYING DATA
router.delete('/destroyer/users', userController.deleteAllUsers)
router.delete('/destroyer/tweets', userController.deleteAllTweets)
router.delete('/destroyer/replies', userController.deleteAllReplies)

// router.put("/users/:id/imgtest", authenticated, upload.fields([{ name: 'cover', maxCount: 1 }, { name:'avatar', maxCount: 1 }]),  userController.putUserImg) 

module.exports = router