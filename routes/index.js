const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')


const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/api/signin')
}


//user相關
router.post('/api/signin', userController.signIn)






//tweets相關






//likes相關







//replies相關



//followships相關









//admin相關

module.exports = router
