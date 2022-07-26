const express = require('express')
const helpers = require('./_helpers')
const cors = require('cors')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

// use helpers.getUser(req) to replace req.user
function authenticated (req, res, next) {
  // passport.authenticate('jwt', { ses...
};

app.use(cors())

app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
