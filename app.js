require('dotenv').config()
const express = require('express')
const routes = require('./routes')
const app = express()
const { getUser } = require('./_helpers')
const port = process.env.PORT || 3000
const cors = require('cors')
const passport = require('./config/passport')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())

app.use(cors())

app.use((req, res, next) => {
  res.locals.user = getUser(req)
  next()
})
// 將 request 導入路由器
app.use(routes)
process.on('unhandledRejection', (reason, promise) => {
  console.log(`Unhandled Rejection at:${reason.stack || reason}`)
})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app
