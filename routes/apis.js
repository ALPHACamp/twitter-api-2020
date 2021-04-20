const express = require('express')
const router = express.Router()

const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const uploadProfile = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])

const userController = require('../controllers/userController')

// routes: login & register
router.post('/login', userController.login)
router.post('/users', userController.register)

// authenticated
const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })

// routes after login
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/tweets', authenticated, userController.getTweetsOfUser)
router.put('/users/:id', authenticated, uploadProfile, userController.putUser)
router.get('/users/:id/replied_tweets', authenticated, userController.getRepliedTweetsOfUser)

module.exports = router
