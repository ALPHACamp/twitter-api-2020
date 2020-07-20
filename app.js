// params
const port = process.env.PORT || 3000

const express = require('express')
const helpers = require('./_helpers')

const routes = require('./routes/index.js')

const app = express()

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

// routes
app.get('/', (req, res) => res.send('Hello World!'))
app.use('/api', routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
