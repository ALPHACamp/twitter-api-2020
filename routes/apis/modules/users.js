const express = require('express')
const { body } = require('express-validator')
const createError = require('http-errors')
const upload = require('../../../middleware/multer')

const router = express.Router()

const userController = require('../../../controllers/user-controller')

router.get('/:userId/tweets', userController.getUserTweets)
router.get('/:userId/replied_tweets', userController.getUserReplies)
router.get('/:userId/likes', userController.getUserLikes)
router.get('/:userId/followers', userController.getUserFollowers)
router.get('/:userId/followings', userController.getUserFollowings)
router.get('/:userId', userController.getUser)
router.put('/:userId', upload.single('file'), userController.putUser)
router.patch('/:userId', body('checkPassword').custom((value, { req }) => {
  if (value !== req.body.password) {
    throw createError(409, 'Password confirmation does not match password!')
  }
  // Indicates the success of this synchronous custom validator
  return true
}), userController.patchUser)

module.exports = router
