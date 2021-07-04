const express = require('express')
const router = express.Router()

const userController = require('../../controllers/userController')

router.post('/', userController.signUp)
router.put('/:user_id', userController.putUser)
router.get('/:user_id/tweets', userController.getTweetsByUser)

module.exports = router
