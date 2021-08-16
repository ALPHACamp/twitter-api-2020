const express = require('express')
const router = express.Router()
const followController = require('../../controllers/api/followController')
const { authenticated, authenticatedUser } = require('../../middleware/auth')

router.use(authenticated, authenticatedUser)
router.post('/', followController.postFollowship)
router.delete('/:id', followController.deleteFollowship)
router.post('/subscription', followController.toggleSubscribe)
module.exports = router
