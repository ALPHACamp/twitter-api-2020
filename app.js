const express = require('express')
// const helpers = require('./_helpers');
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000
const routes = require('./routes')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const passport = require('./config/passport');
const { replaceReqUser } = require('./middlewares/mocha')

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))

app.use(passport.initialize())
app.use(passport.session())

// for mocha test's requirement
app.use(replaceReqUser)

app.use(routes)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
