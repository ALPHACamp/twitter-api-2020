const express = require('express')
const helpers = require('./_helpers');
const routes = require('./routes/index')

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next){
  // passport.authenticate('jwt', { ses...
};

app.use(express.json())
app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
