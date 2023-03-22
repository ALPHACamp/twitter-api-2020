if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const passport = require('./config/passport')
const router = require('./routes')
const app = express()
const port = 3000

app.use(passport.initialize()) // 初始化 Passport
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/v1/api', router) // 使用api路由

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
