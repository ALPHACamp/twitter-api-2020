const express = require('express')
const router = express.Router()

const { authenticated } = require('../../../middleware/api-auth')
const userController = require('../../../controllers/user-controller')
const tempController = require('../../../controllers/temp-controller')

router.get('/top', userController.getTopUsers)
router.get('/:id/followings', tempController.getFollowings)

exports = module.exports = router