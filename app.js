console.log('process.env.NODE_ENV')
console.log('process.env.NODE_ENV')
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
console.log('擺在 doteNV 後')
console.log('擺在 doteNV 後')
console.log('process.env.IMGUR_CLIENT_ID')
console.log('process.env.IMGUR_CLIENT_ID')
console.log(process.env.IMGUR_CLIENT_ID)
console.log('process.env.JWT_SECRET')
console.log('process.env.JWT_SECRET')
console.log(process.env.JWT_SECRET)
// const env = 'development' || 'test'
// if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
//   require('dotenv').config()
// }

const path = require('path')
const express = require('express')
const helpers = require('./_helpers') // AC 為了測試要我們改的，用 getUser(...) 取代 req.user

const app = express()
const port = process.env.PORT || 3000
const passport = require('./config/passport')
const routes = require('./routes') // index 可省略
const methodOverride = require('method-override')
app.use(express.urlencoded({ extended: true }))
app.use(express.json()) // 為了使用 API，引入 body parser 接收 json 功能 (內建於 express)
app.use(passport.initialize())
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))

// use helpers.getUser(req) to replace req.user
function authenticated (req, res, next) {
  // passport.authenticate('jwt', { ses...
};

app.use(routes)
// app.get('/', (req, res) => res.send('Hello World!'))
// app.listen(port, () => console.log(`Example app listening on port ${port}!`))
// (上1) 原本的，下面若不影響 test 就殺
app.listen(port, () => console.log(`Example app listening on http://localhost:${port}`))

module.exports = app
