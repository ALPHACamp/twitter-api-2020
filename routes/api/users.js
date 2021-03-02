const express = require('express')
const userController = require('../../controllers/api/userController')
const router = express.Router()
const { checkIfUser, checkIfAdmin, checkIfLoggedIn } = require('../../utils/authenticator')
const helpers = require('../../_helpers')

router.get('/:id/replied_tweets', checkIfLoggedIn, userController.getRepliedTweetsOfUser)
router.get('/:id/tweets', checkIfLoggedIn, userController.getTweetsOfUser)
router.get('/:id', checkIfLoggedIn, userController.getUser)

//register
router.post('/', userController.register)
//login
router.post('/login', userController.login)

module.exports = router
