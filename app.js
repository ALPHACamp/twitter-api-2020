const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')

const helpers = require('./_helpers');
const passport = require('./config/passport')
const methodOverride = require('method-override')

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
require('./routes')(app)

module.exports = app
