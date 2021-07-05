const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const helpers = require('../_helpers')

router.get('/', helpers.authenticated, helpers.authenticatedAdmin, (req, res) => res.json({ key: req.user }))

router.post('/', userController.signup)
router.post('/signin', userController.signin)

module.exports = router