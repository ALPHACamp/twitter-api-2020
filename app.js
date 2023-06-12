if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const path = require('path')
const cors = require('cors')
const express = require('express')
const routes = require('./routes')
const session = require('express-session')
const passport = require('./config/passport')
const methodOverride = require('method-override')
const SESSION_SECRET = process.env.SESSION_SECRET

const app = express()
const port = process.env.PORT || 3000
// const corsOptions = {
//   origin: [
//     process.env.GITHUB_PAGE,
//     'http://localhost:3000'
//   ],
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//   allowedHeaders: ['Content-Type', 'Authorization']
// }

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use('/api', routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
