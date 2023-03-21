if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')

const passport = require('./config/passport')
const helpers = require('./helpers/auth-helper')
const routes = require('./routes/index')

const app = express()
const port = 3000



// use helpers.getUser(req) to replace req.user
function authenticated (req, res, next) {
  // passport.authenticate('jwt', { ses...
};


// use helpers.getUser(req) to replace req.user
// function authenticated(req, res, next){
//   // passport.authenticate('jwt', { ses...
// };
app.use(passport.initialize())
app.use(express.json())
app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
