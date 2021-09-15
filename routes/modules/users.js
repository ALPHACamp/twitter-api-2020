const express = require('express')
const router = express.Router()
const { authenticated, checkRole } = require("../../middleware/auth");
const passport = require('../../config/passport')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const userController = require('../../controllers/userController')
const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])

router.post('/signup', userController.signUp)

router.post('/signin', userController.signIn)

router.get('/currentuser', authenticated, checkRole(), userController.getCurrentUser)

router.get("/:id", authenticated, checkRole(), userController.getUser);

router.put('/:id', authenticated, checkRole(), cpUpload, userController.putUser)

module.exports = router