const router = require('express').Router()
const passport = require('passport')
const homeController = require('../controllers/homeController')


router.get('/signup', homeController.signUp)

router.get('/signin', homeController.signIn)

router.get('/signin/admin', homeController.signInAdmin)

router.get('/logout', homeController.logout)

router.post('/signin', homeController.postSignIn)

router.post('/users', homeController.postSignUp)

module.exports = router