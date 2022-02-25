const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticated } = require('../../middleware/auth')


router.post('/', userController.signup)
router.get('/:UserId', authenticated, userController.getUser)
router.get('/:UserId/tweets', authenticated, userController.getTweetsOfUser)


module.exports = router