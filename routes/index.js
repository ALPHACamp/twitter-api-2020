const express = require('express')
const router = express.Router()
// const {generalErrorHandler} = require('../middleware')
const replyController = require('../controllers/reply-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)
router.post('/tweets/:id/replies', replyController.postComment)
router.get('/tweets/:id/replies', replyController.getComment)


module.exports = router