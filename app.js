const express = require('express')
const methodOverride = require('method-override')
const helpers = require('./_helpers')
// const { apis } = require('./routes/apis')

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
};

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// app.use('/api', apis)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
