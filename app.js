// params
const port = process.env.PORT || 3000

const express = require('express')
const helpers = require('./_helpers')

const routes = require('./routes/index.js')

const app = express()

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next){
  // passport.authenticate('jwt', { ses...
};

// routes
app.get('/', (req, res) => res.send('Hello World!'))
app.use('/api', routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
