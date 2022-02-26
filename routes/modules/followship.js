const express = require('express')
const { paramsChecker } = require('../../middleware/check-params')
const followshipController = require('../../controllers/followship-controller')
const router = express.Router()

router.get('/top10', followshipController.followshipTop10)
router.post('/', followshipController.addFollowship)
router.delete('/:id', paramsChecker, followshipController.deleteFollowship)

module.exports = router
