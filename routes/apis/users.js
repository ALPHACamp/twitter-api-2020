const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController.js')
const passport = require('../../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })

router.post('/signin', userController.signIn)
router.post('/register',userController.register)
router.put('/:id/setting', userController.putUserSetting)
router.get('/:id', userController.getUser)
router.put('/:id', userController.putUser)



module.exports = router