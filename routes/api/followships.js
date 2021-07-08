const express = require('express')
const router = express.Router()
const followController = require('../../controllers/api/followController')

router.post('/', followController.postFollowship)
router.delete('/:id', followController.deleteFollowship)

module.exports = router