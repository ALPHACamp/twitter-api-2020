const express = require('express')
const router = express.Router()
const replyController = require('../controllers/replyController')

router.post('/:ReplyId/like', replyController.likeReply)
router.post('/:ReplyId/unlike', replyController.unlikeReply)




module.exports = router