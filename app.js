require('dotenv').config()
const express = require('express')
const routes = require('./routes')
const app = express()
const { getUser } = require('./_helpers')
const port = process.env.PORT || 3000
const cors = require('cors')
const passport = require('./config/passport')
const nodemailer = require('nodemailer')
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
  const herokuUser = 'eruc101010@gmail.com'
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'xxxxxxx',
      pass: 'XXXXXXX'
    }
  })
  transporter.verify().then(console.log).catch(console.error)

  const userEmail = herokuUser
  transporter.sendMail({
    from: 'eruc11111@gmail.com', // sender address
    to: userEmail, // list of receivers
    subject: 'Heroku error', // Subject line
    text: `Unhandled Rejection at:${reason.stack || reason}` // plain text body
  })
})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app
