/* setting */
const port = process.env.PORT || 3000
// dotenv.config()
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

/* necessary package */
// express
const express = require('express')
const cors = require('cors')

// passport
const passport = require('./config/passport')
// cors
app.use(cors())
// body-parser
const bodyParser = require('body-parser')
// methodOverride
const methodOverride = require('method-override')

/* app */
const app = express()
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app)

module.exports = app
