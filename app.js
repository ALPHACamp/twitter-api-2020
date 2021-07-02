const express = require('express')
const helpers = require('./_helpers')

const app = express()
const port = 3000

// for mocha test's requirement
app.use((req, res, next) => {
  req.user = helpers.getUser(req)
  next()
})

// use helpers.getUser(req) to replace req.user
function authenticated (req, res, next) {
  // passport.authenticate('jwt', { ses...
}

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
