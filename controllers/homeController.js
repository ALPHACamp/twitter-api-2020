const db = require('../models')
const User = db.User

const homeController = {
  signUp: (req, res) => {
    res.render('signup')
  },

  signIn: (req, res) => {
    res.render('signin')
  },

  signInAdmin: (req, res) => {
    res.render('signinAdmin')
  },

  logout: (req, res) => {
    req.logout()
    res.redirect('/api/signin')
  },

  postSignIn: (req, res) => {
    if (req.user.role === 'admin') {
      return res.redirect('/api/admin')
    }
    return res.redirect('/api/tweets')
  },

  postSignUp: (req, res) => {
    const userData = req.body
    if (req.body.passwordCheck !== req.body.password) {
      return res.redirect('/signup')
    }
    User.create({ ...userData })
      .then(user => {
        return res.redirect('/api/signin')
      })
      .catch(err => {
        return res.redirect('/api/signup')
      })
  }
}

module.exports = homeController