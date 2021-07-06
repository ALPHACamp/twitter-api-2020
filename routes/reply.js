const express = require('express')
const router = express.Router()
const replyController = require('../controllers/replyController')
const helpers = require('../_helpers')

router.post('/:ReplyId/like', helpers.authenticated, helpers.authenticatedUser, replyController.likeReply)

router.post('/:ReplyId/unlike', helpers.authenticated, helpers.authenticatedUser, replyController.unlikeReply)




module.exports = router