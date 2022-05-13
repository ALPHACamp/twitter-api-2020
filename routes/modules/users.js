const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')
const userController = require('../../controllers/user-controller')
router.get('/:id', userController.getUser) // 瀏覽使用者資料
router.put('/:id', upload.single('avatar'), upload.single('cover'), userController.putUser) // 修改使用者資料
// router.get('/:id/tweets', userController.getTweets) // 瀏覽使用者發過的推文
// router.get('/:id/replied_tweets', userController.getRepliedTweets) // 瀏覽使用者回覆的推文
// router.get('/:id/likes', userController.getLikes) // 瀏覽使用者like的推文
// router.get('/:id/followings', userController.getFollowings) // 瀏覽使用者跟隨的人
// router.get('/:id/followers', userController.getFollowers) // 瀏覽使用者的跟隨者

module.exports = router
