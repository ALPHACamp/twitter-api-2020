const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')
const userController = require('../../controllers/user-controller')
const upload = require('../../middleware/multer')

router.post('/users/login', passport.authenticate('local', { session: false }), userController.userLogin)
router.put('/users/:id', userController.putUser)
router.get('/users/:id', userController.getUser)
router.post('/users', upload.single('image'), userController.postUser)
router.get('/users', userController.getUsers)

module.exports = router
