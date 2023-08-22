if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const methodOverride = require('method-override')

const routes = require('./routes')
const passport = require('./config/passport')

const app = express()
const port = process.env.PORT || 3000

// middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(methodOverride('_method'))

// routes
app.use('/api', routes)
app.get('/', (req, res) => { res.send('Hello World!') })

// start
app.listen(port, () => console.log(`Server running on port:${port}!`))

module.exports = app
