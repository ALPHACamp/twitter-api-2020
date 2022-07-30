const express = require('express')
const router = express.Router()
const likeController = require('../../controllers/like-controller')

router.post('/like', likeController.add)
router.post('/unlike', likeController.remove)

module.exports = router