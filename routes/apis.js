/* necessary */
const express = require('express');
const router = express.Router();
const passport = require('../config/passport')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers')
/* Controller */
const userController = require('../controllers/api/userController')

/* authenticated */
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) { return next(err) }
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'without jwt' })
    }
    req.user = user
    return next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (req.user && helpers.getUser(req)) {
    if (helpers.getUser(req).role === "admin") { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

router.get('/', authenticated, (req, res) => res.send('test'))
router.post('/users', userController.signUp) //signUp
router.get('/users/:id', authenticated, userController.getUser) //覽該使用者的個人資料及推文
router.get('/users/:id/tweets', authenticated, userController.getUser)
router.post('/users/signin', userController.signIn) //signin

router.put('/users/:id', upload.fields([{ name: 'avatar', maxCount: 1 },
{ name: 'cover', maxCount: 1 }]), userController.putUsers) //編輯自己資料

module.exports = router