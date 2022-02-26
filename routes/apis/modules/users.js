const express = require('express')
const router = express.Router()

const { authenticated } = require('../../../middleware/api-auth')
const userController = require('../../../controllers/user-controller')
const tempController = require('../../../controllers/temp-controller')


router.get('/:id', authenticated, userController.getUser)
router.get('/:id/followers', tempController.getFollowers)
router.get('/:id/followings', tempController.getFollowings)
router.get('/:id/tweets', authenticated, userController.getTweets)
router.get('/top', authenticated, userController.getTopUsers)


exports = module.exports = router