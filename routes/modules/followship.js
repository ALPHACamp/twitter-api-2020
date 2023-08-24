'use strict'

const router = require('express').Router()

const followshipController = require('../../controllers/followshipController')
const { authenticated } = require('../../middleware/auth')
const { isAuthUser } = require('../../middleware/role-check')

router.post('/', authenticated, isAuthUser, followshipController.addFollowing)
router.delete('/:followingId', authenticated, isAuthUser, followshipController.removeFollowing)

module.exports = router
