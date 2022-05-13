if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')

const { getUser } = require('./_helpers')

const helpers = require('./_helpers')

const session = require('express-session')
const routes = require('./routes')
const passport = require('./config/passport')

const methodOverride = require('method-override')
const cors = require('cors') 


const app = express()
const port = process.env.PORT || 3000

// Setting Cors
app.use(cors())

// Setting body-parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Setting passport
app.use(passport.initialize())
app.use(passport.session())

// Setting middleware
app.use(methodOverride('_method'))

app.use('/api', routes)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
