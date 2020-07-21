// params
if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const port = process.env.PORT || 3000

// modules and files
const express = require('express')
const helpers = require('./_helpers')
const bodyParser = require('body-parser')

// routes
const routes = require('./routes/index.js')

// web server settings
const app = express()

// other middleware settings, request will go through this part
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

// routes
app.get('/', (req, res) => res.send('Hello World!'))
app.use('/api', routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
