const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const admin = require('./modules/admin')
const tweets = require('./modules/tweets')
const { apiErrorHandler } = require('../middleware/error-handler')

router.use('/api/tweets', tweets)

// api/admin
router.use('/api/admin', admin)

// api/users
router.get('/api/users', userController.getUsers)
router.get('/api/signup', userController.signUpPage)
router.post('/api/signup', userController.signUp)

// api/tweets

// router.get("/restaurants", restController.getRestaurants);
// router.use("/", (req, res) => res.redirect("/restaurants"));

router.use('/api/tweets', tweets)
router.use('/', apiErrorHandler)
module.exports = router
