const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const userController = require('../../controllers/userController')
const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])

const authenticated = passport.authenticate("jwt", { session: false });

router.post('/signup', userController.signUp)

router.post('/signin', userController.signIn)

router.get('/currentuser', authenticated, userController.getCurrentUser)

router.put('/:id', authenticated, cpUpload, userController.putUser)

module.exports = router