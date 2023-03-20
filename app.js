if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const helpers = require('./_helpers')

const app = express()
const port = process.env.PORT || 3000
const passport = require('./config/passport')
const routes = require('./routes/index') // index 可省略
const methodOverride = require('method-override')
app.use(express.urlencoded({ extended: true }))
app.use(express.json()) // 為了使用 API，引入 body parser 接收 json 功能 (內建於 express)
app.use(passport.initialize())
app.use(methodOverride('_method'))

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
