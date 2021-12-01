const tweetController = require('../controllers/tweetController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')

module.exports = app => {

  //如果使用者訪問首頁，就導向 /tweets 的頁面
  app.get('/', (req, res) => res.redirect('/tweets'))

  //在 /tweets 底下則交給 tweetController.getRestaurants 來處理
  app.get('/tweets', tweetController.getTweets)

  // 連到 /admin 頁面就轉到 /admin/tweets
  app.get('/admin', (req, res) => res.redirect('/admin/tweets'))

  // 在 /admin/tweets 底下則交給 adminController.getTweets 處理
  app.get('/admin/tweets', adminController.getTweets)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
}