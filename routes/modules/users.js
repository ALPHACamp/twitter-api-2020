const express = require('express')
const router = express.Router()

const { authenticated } = require('../../middleware/auth')

const userController = require('../../controllers/userController')

// Upload image
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of most popular users
 *     description: Retrieve 6 users with most followers. User data includes id, account, name, avatar, and isFollowed.
 *     responses:
 *       '200':
 *         description: A JSON array of user data
 *         content:
 *           application/json:
 *             schema:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The user's ID.
 *                         example: 0
 *                       name:
 *                         type: string
 *                         description: The user's name.
 *                         example: user
 *                       avatar:
 *                         type: string
 *                         description: The user's avatar.
 *                         example: 'https://i.imgur.com/q6bwDGO.png'
 *                       account:
 *                         type: string
 *                         description: The user's account.
 *                         example: 'user1'
 *                       isFollowed:
 *                         type: boolean
 *                         description: The user is followed by the login user.
 *                         example: 'true'
 *
 */

router
  .route('/')
  .get(authenticated, userController.getTopUsers)
  /**
   * @swagger
   * /api/users:
   *   post:
   *     summary: Register an account on Simple Twitter.
   *     description: Register an account on Simple Twitter with required fields.
   *     consumes:
   *       - application/x-www-form-urlencoded
   *     parameters:
   *     responses:
   *       200:
   *         description: Success.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: Response status.
   *                   example: success
   *                 message:
   *                   type: string
   *                   description: Response message.
   *                   example: user1 register successfully! Please login.
   */
  .post(userController.register)

router.post('/login', userController.login)

router
  .route('/:id')
  .all(authenticated)
  .get(userController.getUser)
  .put(
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
