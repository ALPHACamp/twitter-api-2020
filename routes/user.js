const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')


router.get('/', (req, res) => res.redirect('/signin'))
router.get('/signin', userController.signInPage)

router.get('/signup', userController.signUpPage)

router.post('/signup', userController.signUp)

module.exports = router