const express = require('express')
const router = express.Router()
const passport = require('passport')
const { apiErrorHandler } = require('../../middleware/error-handler')
const userController = require('../../controllers/user-controller')
const upload = require('../../middleware/multer')

router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})
router.use((req, res, next) => {
  req.user = req.user || {
    id: 3,
    account: 'user2',
    name: 'user2',
    email: 'user2@example.com',
    password: '$2a$10$C9B49Mh2bvqw3a8CipX/X.eVLtxMOaBB0GOp.Zb8I5mvuZo4GbgQG',
    avatar: 'https://i.imgur.com/slk3L5c.jpeg',
    introduction: 'sdcsdcsv',
    background: 'https://i.imgur.com/EmVcu60.jpeg',
    role: 'user',
    createdAt: '2023-03-20T09:50:09.000Z',
    updatedAt: '2023-03-20T17:16:29.000Z',
    tweetsCounts: 10,
    followersCounts: 2,
    followingsCounts: 4,
    currentUser: false
  }
  next()
})
router.post('/', userController.signUp)
router.post('/test-token', userController.userVerify)
router.post('/login', passport.authenticate('local', { session: false, failureMessage: true, failWithError: true }), userController.signIn, userController.signInFail)

router.get('/tweets', userController.getUserTweets)
router.get('/:id/tweets', userController.getTweets)
router.get('/:id/replied_tweets', userController.getReplies)
router.get('/:id/likes', userController.getLikes)
router.get('/:id/followings', userController.getFollowings)
router.get('/:id/followers', userController.getFollowers)
router.get('/:id', userController.getUser)
router.put(
  '/:id',
  upload.fields([{ name: 'avatar' }, { name: 'background' }]),
  userController.putUser
)
router.use('/', apiErrorHandler)
module.exports = router
