'use strict'

const router = require('express').Router()

const followshipController = require('../../controllers/followshipController')
const { authenticated } = require('../../middleware/auth')
const { isAuthUser } = require('../../middleware/role-check')

router.post('/', authenticated, isAuthUser, followshipController.addFollowing)

module.exports = router
