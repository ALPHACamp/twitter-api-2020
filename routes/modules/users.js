const express = require('express')
const router = express.Router()

const { authenticated, authenticatedUser } = require('../../middleware/auth')

const userController = require('../../controllers/userController')

// Upload image
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

router
  .route('/')
  .get(authenticated, userController.getTopUsers)
  .post(userController.register)

router.route('/login').post(userController.login)

router.route('/current_user').get(authenticated, userController.getCurrentUser)

router
  .route('/:id')
  .all(authenticated)
  .get(userController.getUser)
  .put(
    authenticatedUser,
    upload.fields([
      {
        name: 'avatar',
        maxCount: 1
      },
      {
        name: 'cover',
        maxCount: 1
      }
    ]),
    userController.editUser
  )

router.route('/:id/tweets').get(authenticated, userController.getTweets)

router
  .route('/:id/replied_tweets')
  .get(authenticated, userController.getRepliesAndTweets)

router.route('/:id/likes').get(authenticated, userController.getLikes)

router.route('/:id/followers').get(authenticated, userController.getFollowers)
router.route('/:id/followings').get(authenticated, userController.getFollowings)

module.exports = router
