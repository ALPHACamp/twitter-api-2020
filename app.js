const express = require('express')
const helpers = require('./_helpers')
const routes = require('./routes')
const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
function authenticated (req, res, next) {
  // passport.authenticate('jwt', { ses...
}

app.use('/api', routes)
app.get('/', (req, res) => res.send('Twitter'))
app.listen(port, () => console.log(`Twitter app listening on port ${port}!`))

module.exports = app
