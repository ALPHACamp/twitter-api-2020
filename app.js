if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const path = require('path')
const express = require('express')
const cors = require('cors')
const passport = require('./config/passport')
const { apis } = require('./routes')

const app = express()
const port = process.env.PORT || 3000

// use helpers.getUser(req) to replace req.user
// function authenticated(req, res, next) {
//   // passport.authenticate('jwt', { ses...
// };

app.use(express.urlencoded({ extended: true }))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(express.json()) // 把json 文件功能打開，這樣程式才能解析JSON格式的請求物件
app.use(passport.initialize()) // 初始化 Passport
app.use((req, res, next) => {
  // res.locals.user = getUser(req)
  next()
})

app.use(cors())
app.use('/api', apis)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
