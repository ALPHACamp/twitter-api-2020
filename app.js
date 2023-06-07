if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
//const helpers = require('./_helpers');
const routes = require('./routes')
const methodOverride = require('method-override')
const app = express()
const port = 3000
//const SESSION_SECRET = 'secret'


// use helpers.getUser(req) to replace req.user
//function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
//};
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use('/api', routes)

//app.use(passport.initialize()) // 初始化 Passport
//app.use(passport.session()) // 啟動 session 功能
app.use(methodOverride('_method'))

//app.use(flash()) // 掛載套件
///app.use((req, res, next) => {
  // res.locals.success_messages = req.flash('success_messages') // 設定 success_msg 訊息
  // res.locals.error_messages = req.flash('error_messages') // 設定 warning_msg 訊息
  // res.locals.user = getUser(req)
  // next()
//})

app.use('/api', routes)
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
