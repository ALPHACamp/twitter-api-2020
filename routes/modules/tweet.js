'use strict'

const router = require('express').Router()

const { authenticated } = require('../../middleware/auth')
const tweetController = require('../../controllers/tweetController')

router.get('/', authenticated, tweetController.getTweets)

module.exports = router
