const express = require('express');
const { apis } = require('./routes');
const helpers = require('./_helpers');

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next){
  // passport.authenticate('jwt', { ses...
};

app.use('/api',apis)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
