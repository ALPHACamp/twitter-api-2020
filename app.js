if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const session = require('express-session')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const passport = require('./config/passport')
const { apis } = require('./routes')

const app = express()
const port = process.env.PORT || 3000

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later!'
})

app.use(limiter)
app.set('trust proxy', 1)
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

app.use('/api', apis)
app.use('/', (_, res) => res.status(404).json({ message: '404 Not Found' }))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
