const express = require('express')
const router = express.Router()
const followController = require('../../../controllers/follow-controller')

router.post('/', followController.addFollow)
router.delete('/:followingId', followController.removeFollow)



module.exports = router