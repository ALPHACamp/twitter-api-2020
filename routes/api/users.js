const express = require('express')
const userController = require('../../controllers/api/userController')
const router = express.Router()
const { checkIfUser, checkIfAdmin, checkIfLoggedIn } = require('../../utils/authenticator')
const helpers = require('../../_helpers')

//test
router.get('/test/role/user', checkIfLoggedIn, checkIfUser, (req, res) => {
  return res.json(helpers.getUser(req))
})

router.get('/test/role/admin', checkIfLoggedIn, checkIfAdmin, (req, res) => {
  return res.json(helpers.getUser(req))
})

router.get('/:id', checkIfLoggedIn, userController.getUser)


//register
router.post('/', userController.register)
//login
router.post('/login', userController.login)

module.exports = router
