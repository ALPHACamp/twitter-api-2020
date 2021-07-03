const express = require('express')
const router = express.Router()

const followshipController = require('../../controllers/followshipController')

router.post('/', followshipController.addFollow)
router.delete('/:followingId', followshipController.unFollow)

module.exports = router