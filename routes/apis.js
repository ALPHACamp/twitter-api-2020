/* necessary */
const express = require('express');
const router = express.Router();
const passport = require('../config/passport')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
/* Controller */
const userController = require('../controllers/api/userController')

/* authenticated */
const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}
router.post('/users/:id', userController.signUp) //signUp
router.post('/users', userController.signIn) //signin
router.put('/users/:id', upload.fields([{ name: 'avatar', maxCount: 1 },
{ name: 'cover', maxCount: 1 }]), authenticated, userController.putUsers) //編輯自己資料
module.exports = router