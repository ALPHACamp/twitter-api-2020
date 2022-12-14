const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const tweets = require('./modules/tweets')

router.use('/tweets', tweets)

module.exports = router
