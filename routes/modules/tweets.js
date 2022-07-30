const express = require('express')
const router = express.Router()
const likeController = require('../../controllers/like-controller')

router.post('/:id/like', likeController.add)
router.post('/:id/unlike', likeController.remove)

module.exports = router