if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const passport = require('./config/passport')
const helpers = require('./_helpers')

const app = express()
const port = 3000

const { apis } = require('./routes')

// use helpers.getUser(req) to replace req.user
function authenticated (req, res, next) {
  // passport.authenticate('jwt', { ses...
};

app.use(express.json()) // 把json 文件功能打開，這樣程式才能解析JSON格式的請求物件
app.use(passport.initialize()) // 初始化 Passport
app.use((req, res, next) => {
  next()
})
app.use('/api', apis)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
