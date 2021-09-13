// const router = require('express').Router()
const homeController = require('../controllers/homeController')

// module.exports = (app, passport) => {
//   app.get('/signup', homeController.signUp)
  
//   app.get('/signin', homeController.signIn)
  
//   app.get('/signin/admin', homeController.signInAdmin)
  
//   app.get('/logout', homeController.logout)
  
//   app.post('/signin', homeController.postSignIn)
  
//   app.post('/users', homeController.postSignUp)
// }
router.get('/signup', homeController.signUp)

router.get('/signin', homeController.signIn)

router.get('/signin/admin', homeController.signInAdmin)

router.get('/logout', homeController.logout)

router.post('/signin', homeController.postSignIn)

router.post('/users', homeController.postSignUp)

module.exports = router