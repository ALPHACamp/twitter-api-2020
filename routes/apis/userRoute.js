const express = require('express')
const router = express.Router()

const userController = require('../../controllers/userController')

router.post('/', userController.signUp)
router.get('/:user_id', userController.getUser)
router.put('/:user_id', userController.putUser)
router.put('/:user_id/profile', userController.putUser)
router.get('/:user_id/tweets', userController.getTweets)
router.get('/:user_id/replied_tweets', userController.getReplies)

module.exports = router
