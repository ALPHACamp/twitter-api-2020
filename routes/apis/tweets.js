const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweetController')
const { authenticated, checkRoleIsUser } = require('../../middleware/auth')

router.get('/', authenticated, checkRoleIsUser, tweetController.getTweets)
router.get('/:id', authenticated, checkRoleIsUser, tweetController.getTweet)
router.delete('/:id', authenticated, checkRoleIsUser, tweetController.deleteTweet)
router.post('/', authenticated, checkRoleIsUser, tweetController.postTweet)
router.put('/:id', authenticated, checkRoleIsUser, tweetController.putTweet)
router.post('/:tweetId/replies', authenticated, checkRoleIsUser, tweetController.postReply)
router.get('/:tweetId/replies', authenticated, checkRoleIsUser, tweetController.getReply)
router.post('/:tweetId/like', authenticated, checkRoleIsUser, tweetController.addLike)
router.post('/:tweetId/unlike', authenticated, checkRoleIsUser, tweetController.removeLike)


module.exports = router