const express = require('express')
const router = express.Router()
const followController = require('../../controllers/follow-controller')

router.delete('/:id', followController.deleteFollow)
router.get('/topFollow', followController.topFollow)
router.post('/', followController.postFollow)

module.exports = router
