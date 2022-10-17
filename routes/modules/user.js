const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticated, authenticatedBasic } = require('../../middleware/auth')
const upload = require('../../middleware/multer')
const uploadFields = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'backgroundImage', maxCount: 1 }])

router.post('/signin', userController.signIn)
router.get('/popularUsers', authenticated, userController.getPopularUsers)
router.get('/currentUser', authenticatedBasic, userController.getCurrentUser)
router.get('/:id/tweets', authenticated, userController.getUserTweets)
router.get('/:id/replied_tweets', authenticated, userController.getUserReplies)
router.get('/:id/followers', authenticated, userController.getUserFollowers)
router.get('/:id/followings', authenticated, userController.getUserFollowings)
router.get('/:id/likes', authenticated, userController.getUserLikes)
router.put('/:id/account', authenticated, uploadFields, userController.putUserAccount)
router.put('/:id', authenticated, uploadFields, userController.putUser)
router.get('/:id', authenticated, userController.getUser)
router.post('/', userController.postUser)
router.use('/', apiErrorHandler)


module.exports = router
