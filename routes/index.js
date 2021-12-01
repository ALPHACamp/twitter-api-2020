const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')


const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/api/signin')
}


module.exports = router
