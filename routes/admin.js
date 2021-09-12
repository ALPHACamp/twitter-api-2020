const router = require('express').Router()
const adminController = require('../controllers/adminController')
const db = require('../models')
const User = db.User

router.get('/', adminController.getTweets)

module.exports = router