const express = require('express')
const router = express.Router()
const followController = require('../../controllers/follow-controller')

router.post('/', followController.postFollow)
router.delete('/:id', followController.deleteFollow)

module.exports = router
