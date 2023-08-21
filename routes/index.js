const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const admin = require('./modules/admin')

// api/admin
router.use('/api/admin', admin)
// api/users
router.get('/api/users', userController.getUsers)
router.get('/api/signup', userController.signUpPage)
router.post('/api/signup', userController.signUp)

// api/tweets
// router.get("/restaurants", restController.getRestaurants);
// router.use("/", (req, res) => res.redirect("/restaurants"));

module.exports = router
