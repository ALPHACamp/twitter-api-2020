const express = require("express")
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const imageFields = [{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]
const userController = require('../../controllers/api/userController')
const tweetController = require('../../controllers/api/tweetController')

router.get('/', userController.getUsers)
router.post('/', userController.postUser)
router.get('/:id', userController.getUser)
router.put('/:id', upload.fields(imageFields), userController.putUser)
router.get('/:id/tweets', tweetController.getUserTweets)

module.exports = router