if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
// const helpers = require('./_helpers')
// const flash = require('connect-flash')
const path = require('path')
const passport = require('./config/passport')
const session = require('express-session')
const app = express()
const port = process.env.PORT || 3000
const apis = require('./routes')

const SESSION_SECRET = 'secret'
// use helpers.getUser(req) to replace req.user
/*
function authenticated(req, res, next){
  // passport.authenticate('jwt', { ses...
};
*/
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize()) // 初始化 Passport
app.use(passport.session()) // 啟動Passport 存入session

app.use('/api', apis)
app.get('/', (req, res) => res.send('Hello World!'))
// app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.listen(port, () => console.log(`http://localhost:${port}`))
module.exports = app
