if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const port = process.env.PORT || 3000
const app = express()
const cors = require('cors')
const session = require('express-session')
const SESSION_SECRET = process.env.SESSION_SECRET
const passport = require('./config/passport')
const apis = require('./routes')
const { getUser } = require('./_helpers')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
)
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.user = getUser(req)
  next()
})
const corsOptions = {
  origin: [
    'https://irene289.github.io',
    'http://localhost:8080'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
// app.use(cors())

app.use('/api', apis)
app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () =>
  console.log(`Example app listening on http://localhost:${port}`)
)

module.exports = app
