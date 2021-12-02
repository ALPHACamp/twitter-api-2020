/* necessary */
const express = require('express');
const router = express.Router();
const passport = require('../config/passport')
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

router.post('/users', userController.signIn) //signin
router.post('/users:id', userController.signUp) //signUp
module.exports = router