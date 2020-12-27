const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const helpers = require('../_helpers.js')
const { User } = require('../models')
const bcrypt = require('bcryptjs')


// wrap passport authenticate method to pass mocha test
function authenticated(req, res, next) {
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (error) return next(error)
    if (!user) return res.redirect('/chat/signin')

    const validUserId = user.id || user.dataValues.id // for different environment

    // if (req.method === 'PUT' && validUserId !== Number(req.params.id)) {
    //   return res.status(401).json({ status: 'error', message: '您無權限修改他人資料' })
    // }

    req.user = user
    return next()
  })(req, res, next)
}

function userAuthenticated(req, res, next) {
  if (helpers.getUser(req).role === 'admin') return res.status(401).json({ status: 'error', message: '未被授權' })
  return next()
}

router.get('/signin', (req, res) => {
  res.render('signin', { page: 'sign-in' })
})

router.post('/signin', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email }, raw: true })

    if (user.role !== null || !bcrypt.compareSync(password, user.password)) {
      return res.redirect('/signin')
    }

    return res.json({
      status: 'success',
      message: '成功登入',
      token: jwt.sign({ id: user.id }, process.env.JWT_SECRET),
      user: { id: user.id, account: user.account, name: user.name, email: user.email, role: user.role }
    })

  } catch (error) {
    next(error)
  }
})

router.get('/', authenticated, userAuthenticated, (req, res) => {
  res.render('public', { page: 'public-chat' })
})

router.get('/private', authenticated, userAuthenticated, (req, res) => {
  res.render('private', { page: 'private-chat' })
})

router.get('/:userId', authenticated, userAuthenticated, (req, res) => {
  res.render('private', { page: 'private-chat' })
})


module.exports = router