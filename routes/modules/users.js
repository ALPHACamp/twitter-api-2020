const express = require('express')
const router = express.Router()
const userController = require('../../controllers/apis/user-controller')
const { authenticated } = require('../../middleware/api-auth')
const upload = require('../../middleware/multer')
const fields = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'banner', maxCount: 1 }])
const passport = require('../../config/passport')

router.post('/signin', (req, res, next) => {
  if (!req.body.account || !req.body.password) return res.status(400).json({ status: 'error', message: "Account and Password is required" })
  next()
},
  passport.authenticate('local', { session: false }), userController.signIn)

router.get('/top', authenticated, userController.getTopUsers)
router.get('/setting', authenticated, userController.getSetUser)
router.put('/setting', authenticated, userController.putSetUser)
router.get('/:id/replied_tweets', authenticated, userController.getUserReplies)
router.get('/:id/tweets', authenticated, userController.getUserTweets)
router.get('/:id/likes', authenticated, userController.getUserLikes)
router.get('/:id/followings', authenticated, userController.getUserFollowings)
router.get('/:id/followers', authenticated, userController.getUserFollowers)
router.get('/:id/edit', authenticated, userController.editUser)
router.get('/:id', authenticated, userController.getUser)
router.put('/:id', fields, authenticated, userController.putUser)
router.post('/', userController.signUp)

module.exports = router

