const express = require('express')
const router = express.Router()

const userController = require('../../controllers/follow-controller')

router.delete('/:followingId', userController.removeFollow)
router.post('/', userController.addFollow)

module.exports = router
