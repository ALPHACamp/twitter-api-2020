const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
// const upload = require('../../../middleware/multer')

router.post('/', userController.postSignUp)
router.get('/top', userController.getTopUsers)
router.get('/:id/replied_tweets', userController.getUserRepliedTweets)
router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id', userController.getUser)

module.exports = router
