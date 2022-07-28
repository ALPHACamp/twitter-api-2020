const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')

const { authenticated, authAdmin } = require('../../middleware/auth')
const adminController = require('../../controllers/admin-controller')

router.post('/signin', passport.authenticate('local', { session: false }), adminController.signin)
router.delete('/tweets/:id', authenticated, authAdmin, adminController.deleteTweet)

module.exports = router
