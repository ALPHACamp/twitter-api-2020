const router = require('express').Router()
const userController = require('../../controllers/user-controller')

// 查看特定使用者發過的推文
router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id/replied_tweets', userController.getUserReplies)
router.get('/:id', userController.getUser)

module.exports = router
