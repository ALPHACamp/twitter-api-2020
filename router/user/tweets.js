const router = require('express').Router()
const tweetController = require('../../controllers/user/tweetController')

router.post('/:id/like', tweetController.addLike)
router.post('/:id/unlike', tweetController.removeLike)

module.exports = router
