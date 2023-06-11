// require needed modules
const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticated, authenticatedUser } = require('../../middleware/api-auth')
const { multiUpload } = require('../../middleware/multer')

// require controller
const userController = require('../../controllers/user-controller')

// set router
router.post('/login', passport.authenticate('local', { session: false }), userController.login)
router.get('/:id/tweets', authenticated, authenticatedUser, userController.getUserTweets)
router.get('/:id/replied_tweets', authenticated, authenticatedUser, userController.getUserReplies)
router.get('/:id/likes', authenticated, authenticatedUser, userController.getUserLikes)
router.get('/:id', authenticated, authenticatedUser, userController.getUserInfo)
router.put('/:id', authenticated, authenticatedUser, multiUpload, userController.editUserInfo)
router.post('/', userController.register)

module.exports = router
